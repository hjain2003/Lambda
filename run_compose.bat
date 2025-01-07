@echo off
REM Check if Docker is running
docker info >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Docker is not running. Please start Docker.
    pause
    exit /b 1
)

REM Pull the latest server and client images
echo Pulling latest server and client images...
docker pull hjain2003/lambdaserver:latest
docker pull hjain2003/lambdaclient:latest

REM Navigate to the root directory where docker-compose.yml is located
cd /d "%~dp0"

REM Run Docker Compose
docker-compose up 

pause
