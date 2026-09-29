@echo off
TITLE SKYGUARD - Multi-Sensor Fault Detection Launcher
echo ============================================================
echo Starting SKYGUARD Industrial AI Services...
echo ============================================================

SET SCRIPT_DIR=%~dp0
CD /D "%SCRIPT_DIR%"

SET PYTHON_EXE=%SCRIPT_DIR%.conda\python.exe

IF NOT EXIST "%PYTHON_EXE%" (
    echo [ERROR] Python environment not found at .conda\python.exe!
    echo Falling back to system python...
    SET PYTHON_EXE=python
)

echo.
echo [1/3] Launching FastAPI Backend (http://127.0.0.1:8000) ...
start "SKYGUARD - FastAPI Backend" cmd /k ""%PYTHON_EXE%" -m uvicorn Backend.main:app --host 127.0.0.1 --port 8000 --reload"

echo.
echo [2/3] Launching React Enterprise Frontend (http://127.0.0.1:5173) ...
start "SKYGUARD - React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo [3/3] Launching Legacy Streamlit Dashboard (http://127.0.0.1:8501) ...
start "SKYGUARD - Streamlit Reference UI" cmd /k ""%PYTHON_EXE%" -m streamlit run dashboard/app.py"

echo.
echo Waiting for servers to start...
timeout /t 3 /nobreak > nul

echo Opening SKYGUARD React Frontend in your default browser...
start http://127.0.0.1:5173

echo.
echo ============================================================
echo All SKYGUARD Services Successfully Started!
echo.
echo - React Primary UI:     http://127.0.0.1:5173  (Login: admin / admin123)
echo - FastAPI Backend:     http://127.0.0.1:8000
echo - Swagger API Docs:    http://127.0.0.1:8000/docs
echo - Legacy Streamlit UI: http://127.0.0.1:8501
echo ============================================================
echo Press any key to close launcher window.
pause > nul
