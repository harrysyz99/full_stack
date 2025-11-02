#!/bin/bash

# AI Trading Platform - 启动脚本
# 快速启动开发环境

echo "🚀 启动 AI Trading Platform..."
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装！请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查 MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB 未安装或未在 PATH 中"
    echo "请确保 MongoDB 正在运行..."
else
    echo "✅ MongoDB 已安装"

    # 检查 MongoDB 是否运行
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB 正在运行"
    else
        echo "⚠️  MongoDB 未运行，尝试启动..."
        # macOS
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew services start mongodb-community 2>/dev/null || echo "请手动启动 MongoDB"
        # Linux
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo systemctl start mongod 2>/dev/null || echo "请手动启动 MongoDB"
        fi
    fi
fi

echo ""

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "⚠️  .env 文件不存在，从示例文件创建..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请编辑配置！"
    echo ""
    echo "重要提示："
    echo "1. 修改 JWT_SECRET 为随机密钥"
    echo "2. 可选：添加 API 密钥（NEWS_API_KEY, ALPHA_VANTAGE_API_KEY）"
    echo ""
    read -p "按 Enter 继续或 Ctrl+C 退出编辑 .env..."
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装后端依赖..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 安装前端依赖..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "🎉 准备就绪！"
echo ""
echo "选择启动模式："
echo "1) 开发模式 (前端 + 后端)"
echo "2) 仅后端"
echo "3) 仅前端"
echo "4) 退出"
echo ""
read -p "请选择 [1-4]: " choice

case $choice in
    1)
        echo ""
        echo "🚀 启动开发模式..."
        echo "前端: http://localhost:3000"
        echo "后端: http://localhost:5000"
        echo ""
        npm run dev
        ;;
    2)
        echo ""
        echo "🔧 启动后端服务器..."
        echo "API: http://localhost:5000"
        echo ""
        npm run server
        ;;
    3)
        echo ""
        echo "🎨 启动前端开发服务器..."
        echo "前端: http://localhost:3000"
        echo ""
        npm run client
        ;;
    4)
        echo "👋 再见！"
        exit 0
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac
