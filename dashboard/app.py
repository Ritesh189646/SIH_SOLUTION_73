import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# -------------------------------------------------------------
# Configuration & Layout
# -------------------------------------------------------------
st.set_page_config(
    page_title="AWS Telemetry Diagnostic Engine",
    layout="wide",
    initial_sidebar_state="expanded"
)

# -------------------------------------------------------------
# Cached Data Loader
# -------------------------------------------------------------
from pathlib import Path

# Points to SIH_SOLUTION_73
BASE_DIR = Path(__file__).resolve().parent.parent

@st.cache_data
def load_data():
    data_dir = BASE_DIR / "data"
    synthetic_df = pd.read_csv(data_dir / "synthetic_fault_dataset.csv")
    fault_det_df = pd.read_csv(data_dir / "fault_detection_results.csv")
    diagnostics_df = pd.read_csv(data_dir / "final_complete_test_diagnostics.csv")
    
    # Standardize timestamps
    synthetic_df["timestamp"] = pd.to_datetime(synthetic_df["timestamp"])
    fault_det_df["timestamp"] = pd.to_datetime(fault_det_df["timestamp"])
    
    return synthetic_df, fault_det_df, diagnostics_df

try:
    synthetic_df, fault_det_df, diagnostics_df = load_data()
except Exception as e:
    st.error(f"Error loading datasets: {e}. Please ensure data files exist in `../data/`.")
    st.stop()

# -------------------------------------------------------------
# Sidebar Scenario Selector
# -------------------------------------------------------------
st.sidebar.title("Telemetry Controls")
st.sidebar.markdown("Inspect held-out test scenarios and diagnostic performance.")

test_scenario_ids = sorted(diagnostics_df["scenario_id"].unique())
selected_scenario_id = st.sidebar.selectbox(
    "Select Test Scenario ID",
    options=test_scenario_ids
)

# Filter scenario records
scenario_diag = diagnostics_df[diagnostics_df["scenario_id"] == selected_scenario_id].iloc[0]
scenario_raw = synthetic_df[synthetic_df["scenario_id"] == selected_scenario_id].sort_values("timestamp")
scenario_det = fault_det_df[fault_det_df["scenario_id"] == selected_scenario_id].sort_values("timestamp")

# Merge anomaly flag onto raw data
anomaly_col = "combined_anomaly" if "combined_anomaly" in scenario_det.columns else "final_anomaly"
scenario_raw["is_anomaly"] = scenario_det[anomaly_col].values.astype(bool)

# -------------------------------------------------------------
# Header & Performance KPIs
# -------------------------------------------------------------
st.title("Automated Weather Station (AWS) Diagnostic Pipeline")
st.markdown("Dual-Channel Architecture: **Point Anomaly Detection + Parallel Arbitrated Classification**")

kpi1, kpi2, kpi3, kpi4 = st.columns(4)

true_fault = scenario_diag["fault_type"]
pred_fault = scenario_diag["arbitrated_prediction"]
is_correct = scenario_diag["arbitrated_correct"]
confidence = scenario_diag["root_cause_confidence"]
detected_rows = scenario_diag["detected_rows"]

kpi1.metric("Ground Truth Fault", true_fault.upper())
kpi2.metric("Arbitrated Diagnosis", pred_fault.upper(), delta="CORRECT" if is_correct else "MISCLASSIFIED")
kpi3.metric("Classifier Confidence", f"{confidence:.1%}")
kpi4.metric("Point Anomaly Hits", f"{int(detected_rows)} / 24 hrs")

st.markdown("---")

# -------------------------------------------------------------
# Telemetry Sensor Plots
# -------------------------------------------------------------
st.subheader("24-Hour Multi-Sensor Window Analysis")

# Sensor traces to plot
sensors = ["temp", "rhum", "wspd", "pres"]
sensor_labels = {
    "temp": "Temperature (°C)",
    "rhum": "Relative Humidity (%)",
    "wspd": "Wind Speed (m/s)",
    "pres": "Surface Pressure (hPa)"
}

fig = make_subplots(
    rows=2, cols=2,
    subplot_titles=[sensor_labels[s] for s in sensors],
    vertical_spacing=0.12,
    horizontal_spacing=0.08
)

positions = [(1, 1), (1, 2), (2, 1), (2, 2)]

for (s_key, (r, c)) in zip(sensors, positions):
    if s_key in scenario_raw.columns:
        # Base sensor trace
        fig.add_trace(
            go.Scatter(
                x=scenario_raw["timestamp"],
                y=scenario_raw[s_key],
                mode="lines+markers",
                name=sensor_labels[s_key],
                line=dict(color="#1f77b4", width=2),
                showlegend=False
            ),
            row=r, col=c
        )
        
        # Overlay triggered anomaly points
        anom_subset = scenario_raw[scenario_raw["is_anomaly"]]
        if not anom_subset.empty:
            fig.add_trace(
                go.Scatter(
                    x=anom_subset["timestamp"],
                    y=anom_subset[s_key],
                    mode="markers",
                    name="Anomaly Trigger",
                    marker=dict(color="#d62728", size=8, symbol="x"),
                    showlegend=(r == 1 and c == 1)
                ),
                row=r, col=c
            )

fig.update_layout(
    height=600,
    margin=dict(l=20, r=20, t=40, b=20),
    template="plotly_white"
)

st.plotly_chart(fig, use_container_width=True)

# -------------------------------------------------------------
# Decision Arbitration Diagnostics
# -------------------------------------------------------------
st.subheader("Pipeline Arbitration Trace")

col_left, col_right = st.columns([1, 1])

with col_left:
    st.markdown("##### Channel Diagnostics")
    st.write({
        "Scenario ID": int(selected_scenario_id),
        "Point Detector Fired": bool(scenario_diag["scenario_detected"]),
        "Point Detection Fraction": f"{scenario_diag['detection_fraction']:.2%}",
        "V2 Root-Cause Prediction": scenario_diag["predicted_fault"],
        "V2 Model Confidence": f"{confidence:.4f}",
        "Arbitration Decision Rule": (
            "High Confidence Bypass (>= 0.50)" if confidence >= 0.50 else 
            ("Anomaly Confirmed" if scenario_diag["scenario_detected"] else "Suppressed to Normal")
        )
    })

with col_right:
    st.markdown("##### Architectural Comparison for this Scenario")
    comp_df = pd.DataFrame({
        "Pipeline Mode": [
            "Standalone V2 Classifier",
            "Strict Sequential Gating",
            "Dual-Channel Arbitrated (Deployed)"
        ],
        "Diagnosis": [
            scenario_diag["predicted_fault"],
            "normal" if not scenario_diag["scenario_detected"] else scenario_diag["predicted_fault"],
            pred_fault
        ],
        "Match True Label": [
            scenario_diag["predicted_fault"] == true_fault,
            ("normal" if not scenario_diag["scenario_detected"] else scenario_diag["predicted_fault"]) == true_fault,
            is_correct
        ]
    })
    st.dataframe(comp_df, use_container_width=True)