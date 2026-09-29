"""
Backend/state.py
In-memory state management for SIH Solution 73 API.
Stores the pipeline results and dataset state without needing a database.
"""
from typing import Dict, Any, Optional, List

class PipelineState:
    """
    In-memory storage class for pipeline state and analysis results.
    """
    def __init__(self):
        self.synthetic_df = None
        self.fault_det_df = None
        self.diagnostics_df = None
        self.summary: Optional[Dict[str, Any]] = None
        self.stats: Optional[Dict[str, Any]] = None
        self.anomaly_results: Optional[Dict[str, Any]] = None
        self.classification_results: Optional[Dict[str, Any]] = None
        self.scenarios: List[int] = []
        self.last_run: Optional[str] = None
        self.is_initialized: bool = False

    def reset(self):
        self.synthetic_df = None
        self.fault_det_df = None
        self.diagnostics_df = None
        self.summary = None
        self.stats = None
        self.anomaly_results = None
        self.classification_results = None
        self.scenarios = []
        self.last_run = None
        self.is_initialized = False

    def to_dict(self) -> Dict[str, Any]:
        return {
            "is_initialized": self.is_initialized,
            "last_run": self.last_run,
            "scenario_count": len(self.scenarios),
            "summary": self.summary,
            "stats": self.stats
        }

# Global singleton instance
state = PipelineState()
