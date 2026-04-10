#!/bin/bash
# Vercel Deployment Script for CleanAUS
# Usage: ./deploy-vercel.sh [preview|production]

set -e

DEPLOY_TYPE="${1:-preview}"
PROJECT_NAME="cleanaus"
ORG_NAME="cleanaus"

echo "🚀 CleanAUS Vercel Deployment"
echo "=============================="
echo "Type: $DEPLOY_TYPE"
echo "Project: $PROJECT_NAME"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Installing Vercel CLI..."
  npm install -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
  echo "❌ Not logged in to Vercel. Run 'vercel login' first."
  exit 1
fi

# Build the project
echo "📦 Building project..."
pnpm install --frozen-lockfile
cd apps/web
pnpm build

# Deploy based on type
if [ "$DEPLOY_TYPE" = "production" ]; then
  echo "🌐 Deploying to PRODUCTION..."
  vercel deploy --prod \
    --build-env NEXT_PUBLIC_API_URL=https://api.cleanaus.com.au \
    --yes
else
  echo "🔍 Deploying to PREVIEW..."
  vercel deploy \
    --build-env NEXT_PUBLIC_API_URL=https://staging-api.cleanaus.com.au \
    --yes
fi

echo ""
echo "✅ Deployment complete!"
echo "📊 View deployments: https://vercel.com/${ORG_NAME}/${PROJECT_NAME}"
