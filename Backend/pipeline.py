"""
Backend/pipeline.py
Pipeline Wrapper & Data Orchestrator for SIH Solution 73 API.
Wrapper around existing ML functions and data sources.
Converts outputs to clean JSON-serializable dictionaries for FastAPI boundaries.
DOES NOT MODIFY ANY EXISTING ML CODE.
"""
import os
import math
import logging
import datetime
from pathlib import Path
from typing import Dict, Any, Optional, Union, List

import pandas as pd
import numpy as np

from Backend.state import state

logger = logging.getLogger("sih_solution_73.pipeline")

# Points to SIH_SOLUTION_73 project root
BASE_DIR = Path(__file__).resolve().parent.parent

# Dynamic check for existing ML modules (if implemented in src/)
try:
    import src.preprocessing as preprocessing_mod
except Exception:
    preprocessing_mod = None

try:
    import src.features as features_mod
except Exception:
    features_mod = None

try:
    import src.anomaly_detection as anomaly_det_mod
except Exception:
    anomaly_det_mod = None

try:
    import src.classification as classification_mod
except Exception:
    classification_mod = None


def make_json_serializable(obj: Any) -> Any:
    """
    Recursively converts pandas DataFrames, Series, NumPy types, Timestamps,
    and float NaNs into JSON-serializable Python native objects.
    Enforces clean JSON boundary serialization without mutating original ML data structures.
    """
    if obj is None:
        return None
    elif isinstance(obj, (bool, str, int)):
        return obj
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return float(obj)
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        val = float(obj)
        if math.isnan(val) or math.isinf(val):
            return None
        return val
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, np.ndarray):
        return [make_json_serializable(x) for x in obj.tolist()]
    elif isinstance(obj, (pd.Timestamp, datetime.datetime, datetime.date)):
        return obj.isoformat()
    elif isinstance(obj, pd.DataFrame):
        # Convert timestamp columns to ISO strings before dict conversion
        df = obj.copy()
        for col in df.columns:
            if pd.api.types.is_datetime64_any_dtype(df[col]):
                df[col] = df[col].astype(str)
        return [make_json_serializable(row) for row in df.to_dict(orient="records")]
    elif isinstance(obj, pd.Series):
        s = obj.copy()
        return {str(k): make_json_serializable(v) for k, v in s.to_dict().items()}
    elif isinstance(obj, dict):
        return {str(k): make_json_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, (list, tuple, set)):
        return [make_json_serializable(x) for x in obj]
    else:
        # Fallback to string representation if unknown
        return str(obj)


def load_project_datasets(
    synthetic_path: Optional[Path] = None,
    fault_det_path: Optional[Path] = None,
    diagnostics_path: Optional[Path] = None
):
    """
    Loads project datasets from data/ directory or supplied paths.
    Standardizes timestamp columns.
    """
    data_dir = BASE_DIR / "data"

    s_path = synthetic_path or (data_dir / "synthetic_fault_dataset.csv")
    fd_path = fault_det_path or (data_dir / "fault_detection_results.csv")
    diag_path = diagnostics_path or (data_dir / "final_complete_test_diagnostics.csv")

    if not s_path.exists():
        raise FileNotFoundError(f"Synthetic dataset not found at {s_path}")
    if not fd_path.exists():
        raise FileNotFoundError(f"Fault detection results not found at {fd_path}")
    if not diag_path.exists():
        raise FileNotFoundError(f"Diagnostics results not found at {diag_path}")

    synthetic_df = pd.read_csv(s_path)
    fault_det_df = pd.read_csv(fd_path)
    diagnostics_df = pd.read_csv(diag_path)

    # Standardize timestamps
    if "timestamp" in synthetic_df.columns:
        synthetic_df["timestamp"] = pd.to_datetime(synthetic_df["timestamp"])
    if "timestamp" in fault_det_df.columns:
        fault_det_df["timestamp"] = pd.to_datetime(fault_det_df["timestamp"])

    return synthetic_df, fault_det_df, diagnostics_df


def run_pipeline(
    custom_synthetic_df: Optional[pd.DataFrame] = None,
    custom_fault_det_df: Optional[pd.DataFrame] = None,
    custom_diagnostics_df: Optional[pd.DataFrame] = None
) -> Dict[str, Any]:
    """
    Orchestrates the execution of existing preprocessing, feature engineering,
    anomaly detection, and classification pipeline functions if available, or
    loads precomputed dataset outputs.

    Updates Backend/state.py in-memory state.
    """
    logger.info("Executing telemetry diagnostic pipeline wrapper...")

    # Step 1: Input Data Acquisition / Loading
    if custom_synthetic_df is not None:
        synthetic_df = custom_synthetic_df
        fault_det_df = custom_fault_det_df if custom_fault_det_df is not None else custom_synthetic_df
        diagnostics_df = custom_diagnostics_df if custom_diagnostics_df is not None else pd.DataFrame()
    else:
        synthetic_df, fault_det_df, diagnostics_df = load_project_datasets()

    # Step 2: Preprocessing wrapper call (if functions exist in src/preprocessing.py)
    if preprocessing_mod and hasattr(preprocessing_mod, "preprocess"):
        logger.info("Calling existing preprocessing module...")
        synthetic_df = preprocessing_mod.preprocess(synthetic_df)

    # Step 3: Feature engineering wrapper call (if functions exist in src/features.py)
    if features_mod and hasattr(features_mod, "engineer_features"):
        logger.info("Calling existing feature engineering module...")
        synthetic_df = features_mod.engineer_features(synthetic_df)

    # Step 4: Anomaly detection wrapper call (if functions exist in src/anomaly_detection.py)
    if anomaly_det_mod and hasattr(anomaly_det_mod, "detect_anomalies"):
        logger.info("Calling existing anomaly detection module...")
        fault_det_df = anomaly_det_mod.detect_anomalies(synthetic_df)

    # Step 5: Classification wrapper call (if functions exist in src/classification.py)
    if classification_mod and hasattr(classification_mod, "classify"):
        logger.info("Calling existing classification module...")
        diagnostics_df = classification_mod.classify(synthetic_df, fault_det_df)

    # Step 6: Derive merged flags and calculate pipeline metrics
    anomaly_col = "combined_anomaly" if "combined_anomaly" in fault_det_df.columns else "final_anomaly"
    if anomaly_col in fault_det_df.columns and "scenario_id" in synthetic_df.columns:
        # Map anomaly flags onto raw telemetry records
        synthetic_df["is_anomaly"] = fault_det_df[anomaly_col].values.astype(bool) if len(fault_det_df) == len(synthetic_df) else False
    else:
        synthetic_df["is_anomaly"] = False

    # Extract scenario IDs
    scenarios = []
    if "scenario_id" in diagnostics_df.columns:
        scenarios = sorted([int(x) for x in diagnostics_df["scenario_id"].unique()])
    elif "scenario_id" in synthetic_df.columns:
        scenarios = sorted([int(x) for x in synthetic_df["scenario_id"].unique()])

    # Compute overall statistics (dashboard metrics)
    total_records = len(synthetic_df)
    total_anomalies = int(synthetic_df["is_anomaly"].sum()) if "is_anomaly" in synthetic_df.columns else 0
    normal_records = total_records - total_anomalies
    anomaly_rate = (total_anomalies / total_records) if total_records > 0 else 0.0

    # Classification & arbitration metrics from diagnostics_df
    fault_distribution = {}
    classification_accuracy = None
    root_cause_accuracy = None
    arbitrated_accuracy = None

    if not diagnostics_df.empty:
        if "fault_type" in diagnostics_df.columns:
            fault_distribution = diagnostics_df["fault_type"].value_counts().to_dict()
        
        if "arbitrated_correct" in diagnostics_df.columns:
            arbitrated_accuracy = float(diagnostics_df["arbitrated_correct"].mean())
            classification_accuracy = arbitrated_accuracy
            
        if "correct" in diagnostics_df.columns:
            root_cause_accuracy = float(diagnostics_df["correct"].mean())

    stats = {
        "total_scenarios": len(scenarios),
        "total_records": total_records,
        "total_anomalies": total_anomalies,
        "normal_records": normal_records,
        "anomaly_rate": round(anomaly_rate, 4),
        "classification_accuracy": round(classification_accuracy, 4) if classification_accuracy is not None else None,
        "root_cause_accuracy": round(root_cause_accuracy, 4) if root_cause_accuracy is not None else None,
        "arbitrated_accuracy": round(arbitrated_accuracy, 4) if arbitrated_accuracy is not None else None,
        "fault_distribution": fault_distribution
    }

    # Prepare structured anomaly detection summary
    anomaly_summary = {
        "total_processed_rows": total_records,
        "anomalies_detected": total_anomalies,
        "normal_records": normal_records,
        "anomaly_rate_pct": round(anomaly_rate * 100, 2),
        "sample_anomalies": make_json_serializable(
            synthetic_df[synthetic_df["is_anomaly"]].head(20)
        ) if "is_anomaly" in synthetic_df.columns else []
    }

    # Prepare structured classification summary
    classification_summary = {
        "scenarios_evaluated": len(diagnostics_df),
        "overall_accuracy": round(classification_accuracy, 4) if classification_accuracy is not None else None,
        "fault_counts": fault_distribution,
        "diagnostics_summary": make_json_serializable(diagnostics_df) if not diagnostics_df.empty else []
    }

    pipeline_summary = {
        "execution_timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "status": "success",
        "scenarios_count": len(scenarios),
        "stats": stats
    }

    # Step 7: Update in-memory state
    state.synthetic_df = synthetic_df
    state.fault_det_df = fault_det_df
    state.diagnostics_df = diagnostics_df
    state.summary = make_json_serializable(pipeline_summary)
    state.stats = make_json_serializable(stats)
    state.anomaly_results = make_json_serializable(anomaly_summary)
    state.classification_results = make_json_serializable(classification_summary)
    state.scenarios = scenarios
    state.last_run = datetime.datetime.now(datetime.timezone.utc).isoformat()
    state.is_initialized = True

    logger.info("Pipeline execution completed successfully.")
    return state.summary


def get_scenario_details(scenario_id: int) -> Dict[str, Any]:
    """
    Returns full diagnostics and multi-sensor window records for a specific scenario_id.
    """
    if not state.is_initialized:
        raise ValueError("Pipeline has not been executed yet.")

    diagnostics_df = state.diagnostics_df
    synthetic_df = state.synthetic_df
    fault_det_df = state.fault_det_df

    if scenario_id not in state.scenarios:
        raise ValueError(f"Scenario ID {scenario_id} not found in available test scenarios.")

    scenario_diag = diagnostics_df[diagnostics_df["scenario_id"] == scenario_id].iloc[0].to_dict()
    scenario_raw = synthetic_df[synthetic_df["scenario_id"] == scenario_id].sort_values("timestamp")
    scenario_det = fault_det_df[fault_det_df["scenario_id"] == scenario_id].sort_values("timestamp")

    anomaly_col = "combined_anomaly" if "combined_anomaly" in scenario_det.columns else "final_anomaly"
    is_anomaly = scenario_det[anomaly_col].values.astype(bool) if anomaly_col in scenario_det.columns else False
    scenario_raw_copy = scenario_raw.copy()
    scenario_raw_copy["is_anomaly"] = is_anomaly

    # Format architecture comparison dataframe
    true_fault = scenario_diag.get("fault_type", "unknown")
    pred_fault = scenario_diag.get("arbitrated_prediction", "unknown")
    is_correct = scenario_diag.get("arbitrated_correct", False)
    scenario_detected = scenario_diag.get("scenario_detected", False)
    predicted_fault = scenario_diag.get("predicted_fault", "unknown")

    comparison = [
        {
            "pipeline_mode": "Standalone V2 Classifier",
            "diagnosis": predicted_fault,
            "match_true_label": bool(predicted_fault == true_fault)
        },
        {
            "pipeline_mode": "Strict Sequential Gating",
            "diagnosis": "normal" if not scenario_detected else predicted_fault,
            "match_true_label": bool(("normal" if not scenario_detected else predicted_fault) == true_fault)
        },
        {
            "pipeline_mode": "Dual-Channel Arbitrated (Deployed)",
            "diagnosis": pred_fault,
            "match_true_label": bool(is_correct)
        }
    ]

    result = {
        "scenario_id": scenario_id,
        "diagnostics": make_json_serializable(scenario_diag),
        "architectural_comparison": comparison,
        "sensor_records": make_json_serializable(scenario_raw_copy)
    }
    return result
