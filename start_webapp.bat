@echo off
echo Starting React Web Application...
echo.

cd my-repair-webapp

echo Installing/Updating Node.js dependencies...
call npm install
echo.

echo Starting React development server...
echo The web app will be available at: http://localhost:3000
echo.
echo Make sure the API server is running on http://localhost:8000
echo Press Ctrl+C to stop the development server
call npm start