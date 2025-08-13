#!/bin/bash

echo "🚀 Starting Twibbon Backend Deployment..."

# Create logs directory if not exists
mkdir -p logs

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Install dotenv if not exists
if ! npm list dotenv > /dev/null 2>&1; then
    echo "📦 Installing dotenv..."
    npm install dotenv
fi

# Setup environment file
echo "🔧 Setting up environment variables..."
if [ -f "env.production" ]; then
    cp env.production .env
    echo "✅ Environment file copied from env.production"
else
    echo "⚠️  Warning: env.production not found, please create .env manually"
fi

# Check if PM2 is installed globally
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 not found. Installing PM2 globally..."
    npm install -g pm2
fi

# Stop existing process if running
echo "🛑 Stopping existing process..."
pm2 stop twibbon-backend 2>/dev/null || true
pm2 delete twibbon-backend 2>/dev/null || true

# Start with PM2
echo "▶️ Starting service with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Setup PM2 startup script
echo "🔧 Setting up PM2 startup script..."
pm2 startup

echo "✅ Deployment completed!"
echo "📊 Service status:"
pm2 status
echo ""
echo "📝 Logs available at:"
echo "   - Error logs: ./logs/err.log"
echo "   - Output logs: ./logs/out.log"
echo "   - Combined logs: ./logs/combined.log"
echo ""
echo "🔍 Useful commands:"
echo "   - View logs: pm2 logs twibbon-backend"
echo "   - Restart: pm2 restart twibbon-backend"
echo "   - Stop: pm2 stop twibbon-backend"
echo "   - Status: pm2 status"
