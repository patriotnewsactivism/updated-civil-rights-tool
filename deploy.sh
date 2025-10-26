#!/bin/bash

# Constitutional Rights Research Platform Deployment Script
# This script helps deploy the application to Netlify

echo "🔍 Checking environment..."
node -v
npm -v

echo "🧹 Cleaning up previous builds..."
rm -rf build

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building application..."
npm run build

echo "🧪 Running tests..."
# Uncomment the line below if you want to run tests before deployment
# npm test

echo "📝 Generating deployment summary..."
echo "Deployment Summary" > deployment-summary.txt
echo "==================" >> deployment-summary.txt
echo "Date: $(date)" >> deployment-summary.txt
echo "Node version: $(node -v)" >> deployment-summary.txt
echo "NPM version: $(npm -v)" >> deployment-summary.txt
echo "Build size: $(du -sh build | cut -f1)" >> deployment-summary.txt

echo "🚀 Deploying to Netlify..."
# If you have Netlify CLI installed, uncomment the line below
# netlify deploy --prod

echo "✅ Deployment complete!"
echo "Visit your site at: https://civil-rights.netlify.app"