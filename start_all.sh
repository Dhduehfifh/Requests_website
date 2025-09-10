#!/bin/bash

echo "🚀 启动完整应用..."

# 启动后端
echo "📡 启动后端服务器..."
cd "$(dirname "$0")/backend"
./start_backend.sh &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端
echo "🎨 启动前端服务器..."
cd "../frontends/International Student Life Hub 2_clean"
./start_frontend.sh &
FRONTEND_PID=$!

echo "🎉 应用启动完成！"
echo "📍 后端: http://127.0.0.1:8000"
echo "📍 前端: http://localhost:3000 或 http://localhost:3001"
echo "🛑 按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
