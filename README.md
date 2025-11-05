# texthelp-ai

🚀 **Universal AI Model API Wrapper** - 支持 OpenAI 和 Anthropic API 格式，智能选择最优端点

[![npm](https://img.shields.io/npm/v/texthelp-ai)](https://www.npmjs.com/package/texthelp-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 功能特性

✨ **核心功能：**
- 🤖 支持多种 AI 模型（Claude、GPT、Gemini、Llama 等）
- 🔄 自动检测并转换 API 请求格式
- 📝 智能补全 API 端点 URL
- 🎯 基于模型名称自动选择最优 API 格式
- 📊 统一的响应格式提取
- ⚙️ 灵活的温度和最大令牌参数配置
- 📋 完整的错误处理和日志记录

## 支持的 API 格式

| API 格式 | 支持的模型 | 端点 |
|---------|---------|------|
| **OpenAI Compatible** | GPT-4, GPT-3.5, Gemini, Llama 等 | `/v1/chat/completions` |
| **Anthropic Messages** | Claude-3 系列（Opus, Sonnet, Haiku）| `/v1/messages` |

## 安装

```bash
npm install texthelp-ai
```

或使用 yarn：

```bash
yarn add texthelp-ai
```

## 快速开始

### 基础用法

```typescript
import { handler } from 'texthelp-ai';

const result = await handler({
  input: {
    api_url: 'https://api.example.com/v1',
    api_key: 'sk-xxx',
    model: 'claude-3-5-sonnet',
    user_prompt: 'Hello, what is 2+2?',
    system_prompt: 'You are a helpful assistant.',
    temperature: '0.7',
    max_tokens: '1024'
  },
  logger: console
});

console.log(result.output);
```

### 在扣子平台使用

```typescript
import { handler } from 'texthelp-ai';
import { Args } from 'texthelp-ai';

// 在扣子平台的 handler 中使用
export default handler;
```

### 进阶用法 - 模块化使用

```typescript
import {
  detectApiType,
  normalizeApiUrl,
  transformRequest,
  buildHeaders,
  extractContent
} from 'texthelp-ai';

// 1. 检测 API 类型
const apiType = detectApiType('https://api.example.com/v1/messages');

// 2. 规范化 URL
const { url: normalizedUrl, detectedType } = normalizeApiUrl(
  'https://api.example.com/v1'
);

// 3. 转换请求格式
const requestBody = transformRequest({
  model: 'claude-3-5-sonnet',
  messages: [{ role: 'user', content: 'Hello' }],
  temperature: 0.7,
  max_tokens: 1024
}, detectedType);

// 4. 构建请求头
const headers = buildHeaders('sk-xxx', detectedType);

// 5. 发送请求
const response = await fetch(normalizedUrl, {
  method: 'POST',
  headers,
  body: JSON.stringify(requestBody)
});

// 6. 提取响应
const data = await response.json();
const { content, usage } = extractContent(data, detectedType);

console.log(content); // AI 的响应
console.log(usage);   // 令牌使用情况
```

## API 文档

### handler(args: Args<TexthelpInput>): Promise<TexthelpOutput>

主处理函数，支持自动 API 格式检测和转换。

**参数：**
- `input.api_url` (string, 必须) - API 端点 URL，支持不完整 URL（如 `https://api.example.com/v1`）
- `input.api_key` (string, 必须) - API 密钥
- `input.model` (string, 必须) - 模型名称（如 `claude-3-5-sonnet`、`gpt-4`）
- `input.user_prompt` (string, 必须) - 用户提示词
- `input.system_prompt` (string, 可选) - 系统提示词
- `input.temperature` (string|number, 可选) - 温度参数（0-2，默认 0.7）
- `input.max_tokens` (string|number, 可选) - 最大令牌数（默认 20000000）
- `input.custom_headers` (Record<string, string>, 可选) - 自定义请求头
- `logger` - 日志记录器接口

**返回值：**
```typescript
{
  output: string  // AI 的响应文本
}
```

### detectApiType(apiUrl: string): ApiType

检测 URL 中包含的 API 类型。

```typescript
const type = detectApiType('https://api.example.com/v1/messages');
// 返回: ApiType.ANTHROPIC_MESSAGES
```

### getOptimalApiType(model: string, detectedType: ApiType): ApiType

根据模型名称判断最优的 API 类型。

```typescript
const optimalType = getOptimalApiType('claude-3-5-sonnet', ApiType.UNKNOWN);
// 返回: ApiType.ANTHROPIC_MESSAGES
```

### normalizeApiUrl(url: string, apiType?: ApiType): { url: string; detectedType: ApiType }

规范化 API URL 到完整端点。

```typescript
const { url, detectedType } = normalizeApiUrl('https://api.example.com/v1');
// 返回: {
//   url: 'https://api.example.com/v1/messages',
//   detectedType: ApiType.ANTHROPIC_MESSAGES
// }
```

### transformRequest(unified: UnifiedRequest, apiType: ApiType): any

将请求转换为特定 API 格式。

### extractContent(response: any, apiType: ApiType): UnifiedResponse

从不同格式的响应中提取统一格式的内容。

## 智能模型识别

工具会根据模型名称自动选择正确的 API 格式：

| 模型关键词 | 自动选择的格式 |
|-----------|-------------|
| `claude` | Anthropic Messages (`/v1/messages`) |
| `gpt` | OpenAI Compatible (`/v1/chat/completions`) |
| `gemini` | OpenAI Compatible (`/v1/chat/completions`) |
| `llama` | OpenAI Compatible (`/v1/chat/completions`) |
| 其他 | 使用 URL 检测的类型 |

## 错误处理

```typescript
const result = await handler({
  input: {
    api_url: 'invalid-url',  // 会返回验证错误
    api_key: 'sk-xxx',
    model: 'claude-3-5-sonnet',
    user_prompt: 'Hello'
  },
  logger: console
});

if (result.output.startsWith('关键参数缺失')) {
  console.error('参数验证失败');
}
```

## 常见问题

### Q: 如何与不同的 API 服务商集成？

A: 只需提供服务商的 API 端点和密钥即可。工具会自动检测并选择正确的格式：

```typescript
// 使用 Claude API
await handler({
  input: {
    api_url: 'https://api.anthropic.com',
    api_key: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-sonnet',
    user_prompt: 'Hello'
  }
});

// 使用 OpenAI API
await handler({
  input: {
    api_url: 'https://api.openai.com',
    api_key: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    user_prompt: 'Hello'
  }
});
```

### Q: 支持流式响应吗？

A: 当前版本不支持流式响应（stream: true），返回完整响应。未来版本会添加流式支持。

### Q: 如何自定义请求头？

A: 使用 `custom_headers` 参数：

```typescript
await handler({
  input: {
    api_url: 'https://api.example.com/v1',
    api_key: 'sk-xxx',
    model: 'gpt-4',
    user_prompt: 'Hello',
    custom_headers: {
      'X-Custom-Header': 'value'
    }
  }
});
```

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 支持

如有问题或建议，请访问 [GitHub Issues](https://github.com/1staihub/texthelp-ai/issues)
