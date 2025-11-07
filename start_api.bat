@echo off
echo Starting Repair NLP Assistant API...
echo.

echo Activating virtual environment...
call "C:\Users\Vedant\Desktop\janhavi_models\my_ai_api - Copy\my_ai_api - Copy\venv\Scripts\activate.bat"

echo.
echo Starting FastAPI server...
echo The API will be available at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000