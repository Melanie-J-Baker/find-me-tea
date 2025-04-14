#!/bin/bash

# Exit on any error
set -e

# Config
BUILD_DIR="dist"
S3_BUCKET="s3://www.findmetea.com"
REGION="us-east-1"

echo "Running npm build..."
npm run build

echo "Uploading files to S3..."
aws s3 sync $BUILD_DIR $S3_BUCKET --region $REGION --delete

echo "Deployment complete!"
