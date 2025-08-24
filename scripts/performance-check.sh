#!/bin/bash

# Performance monitoring script for code-clash
echo "🚀 AlgoWars Performance Analysis"
echo "================================"

# Frontend analysis
echo "📊 Frontend Bundle Analysis:"
cd frontend
npm run build
echo "✅ Build completed"

# Check bundle sizes
if [ -d ".next" ]; then
    echo "📦 Bundle sizes:"
    du -sh .next/static/chunks/* | sort -hr | head -10
fi

# Backend performance
echo ""
echo "🔧 Backend Optimization Status:"
cd ../backend

# Check if compression middleware is enabled
if grep -q "compress" src/app.js; then
    echo "✅ Compression: Enabled"
else
    echo "❌ Compression: Not enabled"
fi

# Check Redis connection
if grep -q "redis" package.json; then
    echo "✅ Redis: Configured"
else
    echo "❌ Redis: Not configured"
fi

echo ""
echo "💡 Performance Recommendations:"
echo "1. Enable Vercel Analytics for detailed metrics"
echo "2. Consider using Vercel Image Optimization"
echo "3. Set up Uptime monitoring for your Render backend"
echo "4. Monitor Core Web Vitals in production"

# Test API response times
echo ""
echo "⏱️  API Response Time Test:"
time curl -s https://codeclash-xt7g.onrender.com/health > /dev/null
echo "✅ Health endpoint tested"
