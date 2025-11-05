#!/bin/bash

# 测试 Anthropic API 连接

API_URL="https://q.quuvv.cn/v1/messages"
API_KEY="sk-7rfzgWuLkdlCI40tkg98CtdNBiWTJPiH1jdmXTrHl3aTZCnl"

echo "测试 API 端点: $API_URL"
echo ""

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "messages": [
      {
        "role": "user",
        "content": "你好"
      }
    ],
    "system": "你是一个有帮助的助手",
    "temperature": 0.7,
    "max_tokens": 100
  }' \
  -v 2>&1 | head -100
