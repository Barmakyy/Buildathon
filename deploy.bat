@echo off
REM Buildathon Deployment Script to Google Cloud Run (Windows)

setlocal enabledelayedexpansion

echo.
echo 🚀 Buildathon Deployment to Google Cloud Run
echo.

REM Check if gcloud is installed
where gcloud >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Google Cloud SDK not found. Install from: https://cloud.google.com/sdk/docs/install
    exit /b 1
)

REM Get user input
set /p PROJECT_ID="Enter your GCP Project ID: "
set /p REGION="Enter Google Cloud Region (default: us-central1): "
if "%REGION%"=="" set REGION=us-central1

set /p GEMINI_API_KEY="Enter GEMINI_API_KEY: "
set /p MONGODB_URI="Enter MONGODB_URI: "

echo.
echo 📌 Project: %PROJECT_ID%, Region: %REGION%
echo.

REM Set project
gcloud config set project %PROJECT_ID%

REM Enable APIs
echo 🔧 Enabling required APIs...
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com

REM Deploy Server
echo.
echo 📦 Building and deploying server...
gcloud run deploy elimu-ai-server ^
  --source ./server ^
  --platform managed ^
  --region %REGION% ^
  --allow-unauthenticated ^
  --set-env-vars NODE_ENV=production,GEMINI_API_KEY=%GEMINI_API_KEY%,MONGODB_URI=%MONGODB_URI% ^
  --memory 512Mi ^
  --cpu 1 ^
  --timeout 3600

for /f "delims=" %%i in ('gcloud run services describe elimu-ai-server --region %REGION% --format="value(status.url)"') do set SERVER_URL=%%i
echo ✅ Server deployed: %SERVER_URL%

REM Deploy Client
echo.
echo 📦 Building and deploying client...
gcloud run deploy elimu-ai-client ^
  --source ./client ^
  --platform managed ^
  --region %REGION% ^
  --allow-unauthenticated ^
  --build-arg VITE_API_URL=%SERVER_URL% ^
  --memory 256Mi ^
  --cpu 1

for /f "delims=" %%i in ('gcloud run services describe elimu-ai-client --region %REGION% --format="value(status.url)"') do set CLIENT_URL=%%i
echo ✅ Client deployed: %CLIENT_URL%

echo.
echo 🎉 Deployment Complete!
echo 📱 Client: %CLIENT_URL%
echo 🔗 Server: %SERVER_URL%
echo.
echo ⚠️  Update your server's CLIENT_URL environment variable:
echo gcloud run services update elimu-ai-server --region %REGION% --set-env-vars CLIENT_URL=%CLIENT_URL%

pause
