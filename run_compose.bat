@echo off
REM Check if Docker is running
docker info >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Docker is not running. Please start Docker.
    exit /b 1
)

REM Navigate to a specific directory where your docker-compose.yml is located


REM Run Docker Compose
docker-compose up --build

pause