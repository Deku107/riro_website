#!/bin/bash

echo "Building Riro Talehouse Website for Production"
echo "=============================================="

# Build frontend
echo "Building frontend..."
cd frontend
npm ci
npm run build

echo "Frontend build complete!"
echo "Build files located in: ./dist"

# Create production package for backend
echo "Preparing backend for production..."
cd ../backend

# Install production dependencies only
npm ci --production

echo "Backend ready for production!"
echo ""
echo "Next steps:"
echo "1. Upload entire project to server"
echo "2. Configure environment variables"
echo "3. Follow PLESK_DEPLOYMENT.md instructions"
