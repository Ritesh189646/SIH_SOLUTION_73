"""
Backend/main.py
FastAPI Application Entrypoint for SIH Solution 73 API.
Exposes RESTful endpoints for React/Vite frontend integration.
Wraps around existing ML functions and pipeline execution without touching ML code.
"""
import os
import io
import time
import logging
from typing import Optional, List, Dict, Any

import pandas as pd
from fastapi import FastAPI, HTTPException, status, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from Backend.state import state
from Backend import pipeline

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("sih_solution_73.api")

app = FastAPI(
    title="SIH Solution 73 API",
    description="Automated Weather Station (AWS) Diagnostic Engine API Layer",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

env_cors = os.getenv("CORS_ORIGINS")
if env_cors:
    additional_origins = [o.strip() for o in env_cors.split(",") if o.strip()]
    origins.extend(additional_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """
    API Startup Event Logger & Auto-Initialization.
    Loads existing data into pipeline state on startup so endpoints are immediately ready.
    """
    logger.info("SIH Solution 73 FastAPI Backend starting up...")
    try:
        pipeline.run_pipeline()
        logger.info("Pipeline automatically initialized on startup.")
    except Exception as e:
        logger.warning(f"Startup pipeline auto-initialization deferred: {e}")


@app.get("/", tags=["General"])
async def root():
    """
    Root endpoint returning service status message.
    """
    return {
        "status": "ok",
        "service": "SIH Solution 73 API",
        "version": "1.0.0",
        "docs_url": "/docs"
    }


@app.get("/health", tags=["General"])
async def health():
    """
    Health check endpoint.
    """
    return {
        "status": "ok",
        "service": "SIH Solution 73 API"
    }


@app.post("/analysis/run", tags=["Pipeline"])
async def run_analysis():
    """
    POST /analysis/run
    Executes the existing ML pipeline on the project data.
    Updates in-memory state and returns summary metrics.
    """
    start_time = time.time()
    logger.info("Received request to run telemetry pipeline analysis...")
    try:
        summary = pipeline.run_pipeline()
        elapsed = round(time.time() - start_time, 3)
        logger.info(f"Pipeline analysis completed in {elapsed}s.")
        return {
            "success": True,
            "message": "Analysis completed successfully",
            "execution_time_seconds": elapsed,
            "summary": summary
        }
    except Exception as e:
        logger.error(f"Pipeline execution error: {e}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": f"Error executing pipeline: {str(e)}"
            }
        )


@app.get("/stats", tags=["Metrics"])
async def get_stats():
    """
    GET /stats
    Returns dashboard-level metrics derived from pipeline execution.
    """
    if not state.is_initialized or state.stats is None:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "message": "Analysis has not been run yet."
            }
        )
    return {
        "success": True,
        "stats": state.stats
    }


@app.get("/anomaly/results", tags=["Analysis Results"])
async def get_anomaly_results(scenario_id: Optional[int] = Query(None, description="Optional scenario ID filter")):
    """
    GET /anomaly/results
    Returns anomaly detection outputs produced by the pipeline.
    Optionally filter by scenario_id.
    """
    if not state.is_initialized or state.anomaly_results is None:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "message": "Analysis has not been run yet."
            }
        )

    if scenario_id is not None:
        try:
            scenario_data = pipeline.get_scenario_details(scenario_id)
            records = scenario_data["sensor_records"]
            anomalies = [r for r in records if r.get("is_anomaly")]
            normal = [r for r in records if not r.get("is_anomaly")]
            return {
                "success": True,
                "scenario_id": scenario_id,
                "total": len(records),
                "anomalies": anomalies,
                "normal": normal
            }
        except ValueError as ve:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"success": False, "message": str(ve)}
            )

    return {
        "success": True,
        "results": state.anomaly_results
    }


@app.get("/classification/results", tags=["Analysis Results"])
async def get_classification_results(scenario_id: Optional[int] = Query(None, description="Optional scenario ID filter")):
    """
    GET /classification/results
    Returns classification & diagnostic results produced by the pipeline.
    Optionally filter by scenario_id.
    """
    if not state.is_initialized or state.classification_results is None:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "message": "Analysis has not been run yet."
            }
        )

    if scenario_id is not None:
        try:
            scenario_data = pipeline.get_scenario_details(scenario_id)
            return {
                "success": True,
                "scenario_id": scenario_id,
                "diagnostics": scenario_data["diagnostics"],
                "architectural_comparison": scenario_data["architectural_comparison"]
            }
        except ValueError as ve:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"success": False, "message": str(ve)}
            )

    return {
        "success": True,
        "results": state.classification_results
    }


@app.get("/results", tags=["Analysis Results"])
async def get_combined_results(scenario_id: Optional[int] = Query(None, description="Optional scenario ID filter")):
    """
    GET /results
    Returns combined summary of stats, anomaly results, and classification diagnostics
    for dashboard consumption.
    """
    if not state.is_initialized:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "message": "Analysis has not been run yet."
            }
        )

    if scenario_id is not None:
        try:
            scenario_data = pipeline.get_scenario_details(scenario_id)
            return {
                "success": True,
                "scenario_id": scenario_id,
                "summary": state.summary,
                "scenario_diagnostics": scenario_data["diagnostics"],
                "architectural_comparison": scenario_data["architectural_comparison"]
            }
        except ValueError as ve:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"success": False, "message": str(ve)}
            )

    return {
        "success": True,
        "summary": state.summary,
        "stats": state.stats,
        "anomaly": state.anomaly_results,
        "classification": state.classification_results
    }


@app.get("/scenarios", tags=["Scenarios"])
async def list_scenarios():
    """
    GET /scenarios
    Returns list of available held-out test scenario IDs.
    """
    if not state.is_initialized:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "message": "Analysis has not been run yet."
            }
        )
    return {
        "success": True,
        "count": len(state.scenarios),
        "scenarios": state.scenarios
    }


@app.get("/scenarios/{scenario_id}", tags=["Scenarios"])
async def get_scenario(scenario_id: int):
    """
    GET /scenarios/{scenario_id}
    Returns detailed diagnostics, architectural comparison, and 24-hour multi-sensor telemetry records
    for the selected scenario ID.
    """
    if not state.is_initialized:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "message": "Analysis has not been run yet."
            }
        )
    try:
        scenario_details = pipeline.get_scenario_details(scenario_id)
        return {
            "success": True,
            "scenario": scenario_details
        }
    except ValueError as ve:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": str(ve)}
        )


@app.post("/data/upload", tags=["Pipeline"])
async def upload_data(file: UploadFile = File(...)):
    """
    POST /data/upload
    Accepts CSV telemetry dataset uploads via Multipart Form Data.
    Validates CSV, processes data through the existing pipeline, and updates state.
    """
    if not file.filename.endswith(".csv"):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "message": "Only CSV files are accepted."
            }
        )

    logger.info(f"Processing uploaded CSV file: {file.filename}")
    try:
        contents = await file.read()
        uploaded_df = pd.read_csv(io.BytesIO(contents))
        
        # Run pipeline with uploaded dataset
        summary = pipeline.run_pipeline(custom_synthetic_df=uploaded_df)
        
        return {
            "success": True,
            "message": f"File '{file.filename}' uploaded and processed successfully",
            "rows_processed": len(uploaded_df),
            "summary": summary
        }
    except Exception as e:
        logger.error(f"Error processing uploaded CSV: {e}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": f"Error parsing uploaded file: {str(e)}"
            }
        )
