#!/bin/bash
# Buildathon Deployment Script to Google Cloud Run

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Buildathon Deployment to Google Cloud Run${NC}\n"

# Check prerequisites
if ! command -v gcloud &> /dev/null; then
    echo -e "${YELLOW}❌ Google Cloud SDK not found. Install it from: https://cloud.google.com/sdk/docs/install${NC}"
    exit 1
fi

# Get configuration from user
read -p "Enter your GCP Project ID: " PROJECT_ID
read -p "Enter Google Cloud Region (default: us-central1): " REGION
REGION=${REGION:-us-central1}

read -p "Enter GEMINI_API_KEY: " GEMINI_API_KEY
read -p "Enter MONGODB_URI: " MONGODB_URI

# Set project
gcloud config set project $PROJECT_ID

echo -e "${BLUE}📌 Project: $PROJECT_ID, Region: $REGION${NC}\n"

# Enable APIs
echo -e "${BLUE}🔧 Enabling required APIs...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Deploy Server
echo -e "\n${BLUE}📦 Building and deploying server...${NC}"
gcloud run deploy elimu-ai-server \
  --source ./server \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,GEMINI_API_KEY=$GEMINI_API_KEY,MONGODB_URI=$MONGODB_URI \
  --memory 512Mi \
  --cpu 1 \
  --timeout 3600

SERVER_URL=$(gcloud run services describe elimu-ai-server --region $REGION --format='value(status.url)')
echo -e "${GREEN}✅ Server deployed: $SERVER_URL${NC}"

# Deploy Client
echo -e "\n${BLUE}📦 Building and deploying client...${NC}"
gcloud run deploy elimu-ai-client \
  --source ./client \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --build-arg VITE_API_URL=$SERVER_URL \
  --memory 256Mi \
  --cpu 1

CLIENT_URL=$(gcloud run services describe elimu-ai-client --region $REGION --format='value(status.url)')
echo -e "${GREEN}✅ Client deployed: $CLIENT_URL${NC}"

echo -e "\n${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}📱 Client: $CLIENT_URL${NC}"
echo -e "${GREEN}🔗 Server: $SERVER_URL${NC}"
echo -e "\n${YELLOW}⚠️  Update your server's CLIENT_URL environment variable:${NC}"
echo "gcloud run services update elimu-ai-server --region $REGION --set-env-vars CLIENT_URL=$CLIENT_URL"
