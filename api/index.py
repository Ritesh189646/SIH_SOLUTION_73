"""
api/index.py
Vercel Serverless Function Entrypoint for FastAPI Backend (SIH Solution 73).
Imports the existing FastAPI app instance from Backend.main.
"""
import sys
from pathlib import Path

# Ensure project root is available on sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from Backend.main import app
