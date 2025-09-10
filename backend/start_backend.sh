#!/bin/bash

echo "🚀 启动后端服务器..."

# 停止占用端口8000的进程
echo "📋 检查端口8000占用情况..."
if lsof -ti:8000 > /dev/null 2>&1; then
    echo "⚠️  发现端口8000被占用，正在停止..."
    lsof -ti:8000 | xargs kill -9
    sleep 2
    echo "✅ 端口8000已释放"
else
    echo "✅ 端口8000可用"
fi

# 启动PHP服务器
echo "🔧 启动PHP开发服务器..."
cd "$(dirname "$0")"
php -S 127.0.0.1:8000 -t public/

echo "🎉 后端服务器启动完成！"
echo "📍 访问地址: http://127.0.0.1:8000"
echo "🛑 按 Ctrl+C 停止服务器"
