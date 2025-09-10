#!/bin/bash

echo "🚀 启动前端服务器..."

# 停止占用端口3000和3001的进程
echo "📋 检查端口3000和3001占用情况..."
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  发现端口3000被占用，正在停止..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
    echo "✅ 端口3000已释放"
fi

if lsof -ti:3001 > /dev/null 2>&1; then
    echo "⚠️  发现端口3001被占用，正在停止..."
    lsof -ti:3001 | xargs kill -9
    sleep 2
    echo "✅ 端口3001已释放"
fi

# 启动前端服务器
echo "🔧 启动Vite开发服务器..."
cd "$(dirname "$0")"
npm run dev

echo "🎉 前端服务器启动完成！"
echo "📍 访问地址: http://localhost:3000 或 http://localhost:3001"
echo "🛑 按 Ctrl+C 停止服务器"
