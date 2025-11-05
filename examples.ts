/**
 * TextHelp AI - 扣子平台集成指南
 *
 * 这是一个通用的 AI API 包装工具，支持 OpenAI 和 Anthropic 格式的 API。
 * 工具会根据模型名称自动识别 API 类型并进行格式转换。
 */

import { handler } from "./src/index";

/**
 * ========================================
 * 扣子平台使用方法
 * ========================================
 *
 * 在扣子平台中，该工具会自动调用 handler 函数处理输入参数。
 *
 * ## 元数据配置（必填参数）
 *
 * ```json
 * {
 *   "api_url": "string - AI API 的完整 URL 或基础 URL",
 *   "api_key": "string - API 密钥",
 *   "model": "string - 模型名称（如 claude-3-5-sonnet, gpt-4）",
 *   "user_prompt": "string - 用户输入的提示词"
 * }
 * ```
 *
 * ## 可选参数
 *
 * ```json
 * {
 *   "system_prompt": "string - 系统级提示词，定义 AI 的角色和行为",
 *   "temperature": "number (0-2) - 温度参数，控制随机性。默认 0.7",
 *   "max_tokens": "number - 最大输出令牌数。默认 20000000"
 * }
 * ```
 *
 * ## 输出格式
 *
 * ```json
 * {
 *   "output": "string - AI 生成的文本内容"
 * }
 * ```
 *
 * ========================================
 * 使用示例
 * ========================================
 *
 * ### 示例 1: 使用 Claude 模型
 *
 * ```json
 * {
 *   "api_url": "https://api.anthropic.com",
 *   "api_key": "sk-ant-xxx...",
 *   "model": "claude-3-5-sonnet",
 *   "user_prompt": "写一个 Hello World 程序",
 *   "system_prompt": "你是一个编程助手，用中文回答问题",
 *   "temperature": "0.7",
 *   "max_tokens": "2048"
 * }
 * ```
 *
 * 自动识别：模型名称包含 "claude" → 使用 Anthropic Messages API 格式
 * 自动补全：URL 末尾添加 "/v1/messages"（如果缺失）
 *
 * ### 示例 2: 使用 OpenAI GPT 模型
 *
 * ```json
 * {
 *   "api_url": "https://api.openai.com/v1",
 *   "api_key": "sk-proj-xxx...",
 *   "model": "gpt-4",
 *   "user_prompt": "What is the capital of France?",
 *   "system_prompt": "You are a helpful assistant.",
 *   "temperature": "0.8"
 * }
 * ```
 *
 * 自动识别：模型名称包含 "gpt" → 使用 OpenAI Chat Completions API 格式
 * 自动补全：URL 末尾添加 "/chat/completions"（如果缺失）
 *
 * ### 示例 3: 使用代理 API 服务
 *
 * ```json
 * {
 *   "api_url": "https://api-proxy.example.com/v1",
 *   "api_key": "your-proxy-key",
 *   "model": "claude-3-haiku-4-5",
 *   "user_prompt": "你好，请介绍一下自己",
 *   "temperature": "0.6",
 *   "max_tokens": "1024"
 * }
 * ```
 *
 * 自动识别：模型名称包含 "claude" → 使用 Anthropic 格式
 * 自动补全：不完整 URL 自动补全为完整端点
 *
 * ### 示例 4: Gemini 或其他模型
 *
 * ```json
 * {
 *   "api_url": "https://api.example.com/v1",
 *   "api_key": "your-key",
 *   "model": "gemini-2.0-flash",
 *   "user_prompt": "解释什么是机器学习"
 * }
 * ```
 *
 * 自动识别：模型名称包含 "gemini" → 使用 OpenAI 兼容格式
 *
 * ========================================
 * 工具工作原理
 * ========================================
 *
 * 1. **参数验证**：检查必填参数（api_url, api_key, model, user_prompt）
 * 2. **URL 验证**：确保提供有效的 HTTPS URL
 * 3. **API 类型检测**：
 *    - 根据 URL 路径识别（/messages → Anthropic，/chat/completions → OpenAI）
 *    - 根据模型名称优化识别
 * 4. **URL 规范化**：自动补全不完整的 URL
 * 5. **请求转换**：将输入参数转换为目标 API 格式
 * 6. **请求头构建**：根据 API 类型添加适当的认证和内容类型
 * 7. **API 调用**：发送 HTTP POST 请求到 AI API
 * 8. **响应提取**：从各种 API 格式的响应中提取文本内容
 * 9. **返回结果**：以统一格式返回 AI 生成的内容
 *
 * ========================================
 * 支持的模型列表
 * ========================================
 *
 * ### Anthropic Claude 模型（自动识别 "claude"）
 * - claude-3-5-sonnet
 * - claude-3-5-haiku
 * - claude-3-opus
 * - claude-3-sonnet
 * - claude-3-haiku
 * - claude-haiku-4-5
 * 等其他 Claude 模型
 *
 * ### OpenAI GPT 模型（自动识别 "gpt"）
 * - gpt-4
 * - gpt-4-turbo
 * - gpt-4o
 * - gpt-3.5-turbo
 * 等其他 GPT 模型
 *
 * ### 其他模型（自动识别对应关键词）
 * - Gemini 系列（关键词：gemini）
 * - Llama 系列（关键词：llama）
 * 等其他兼容 OpenAI 格式的模型
 *
 * ========================================
 * 错误处理
 * ========================================
 *
 * 如果出现错误，工具会返回：
 * {
 *   "output": "错误信息描述"
 * }
 *
 * 常见错误：
 * - "关键参数缺失" → 检查必填参数
 * - "无效的 API URL" → 确保 URL 以 http:// 或 https:// 开头
 * - "API 请求失败: 401" → API 密钥无效或过期
 * - "API 请求失败: 429" → 请求频率过高，请稍后重试
 * - "API 请求失败: 500" → API 服务出错
 */

// 扣子平台会自动调用这个 handler 函数
export default handler;

/**
 * ========================================
 * 如何在扣子平台中使用此工具
 * ========================================
 *
 * ## 步骤 1: 在扣子中创建工具
 *
 * 1. 在扣子平台中创建新的工具或插件
 * 2. 选择"自定义代码"或"JavaScript/TypeScript"选项
 * 3. 粘贴 export default handler 这行代码
 *
 * ## 步骤 2: 配置工具元数据
 *
 * 在扣子平台的工具配置界面，添加以下参数：
 *
 * ### 输入参数配置
 *
 * | 参数名 | 类型 | 必填 | 说明 | 示例 |
 * |--------|------|------|------|------|
 * | api_url | string | 是 | AI API 的 URL | https://api.anthropic.com 或 https://api.openai.com/v1 |
 * | api_key | string | 是 | API 密钥 | sk-ant-xxx 或 sk-proj-xxx |
 * | model | string | 是 | 模型名称 | claude-3-5-sonnet 或 gpt-4 |
 * | user_prompt | string | 是 | 用户提示词 | "写一个 Python 斐波那契函数" |
 * | system_prompt | string | 否 | 系统提示词 | "你是一个编程专家" |
 * | temperature | number | 否 | 温度 (0-2) | 0.7 |
 * | max_tokens | number | 否 | 最大令牌数 | 2048 |
 * | custom_headers | object | 否 | 自定义请求头 | {"X-Custom": "value"} |
 *
 * ### 输出参数配置
 *
 * | 参数名 | 类型 | 说明 |
 * |--------|------|------|
 * | output | string | AI 生成的文本内容 |
 *
 * ## 步骤 3: 在扣子工作流中使用
 *
 * 在扣子的工作流编辑器中：
 *
 * 1. 添加此工具的节点
 * 2. 连接上游节点作为输入源
 * 3. 配置参数绑定：
 *
 *    ```
 *    api_url: 选择或输入 API URL
 *    api_key: 使用密钥管理或输入密钥
 *    model: 选择使用的模型
 *    user_prompt: 绑定用户输入或上游节点的输出
 *    system_prompt: (可选) 定义系统角色
 *    temperature: (可选) 设置创意程度
 *    max_tokens: (可选) 限制输出长度
 *    ```
 *
 * 4. 连接输出到后续节点
 *
 * ## 直接调用示例代码
 *
 * 如果你想在扣子中直接调用 handler，可以这样写：
 *
 * ### 示例 1: 基础调用 (Claude)
 *
 * ```typescript
 * import { handler } from "texthelp-ai";
 *
 * const result = await handler({
 *   input: {
 *     api_url: "https://api.anthropic.com",
 *     api_key: "sk-ant-xxx...",
 *     model: "claude-3-5-sonnet",
 *     user_prompt: "写一个 Hello World 程序",
 *     system_prompt: "你是一个编程助手",
 *     temperature: "0.7",
 *     max_tokens: "2048"
 *   },
 *   logger: {
 *     debug: (msg, data) => console.log(`[DEBUG] ${msg}`, data),
 *     info: (msg, data) => console.log(`[INFO] ${msg}`, data),
 *     warn: (msg, data) => console.warn(`[WARN] ${msg}`, data),
 *     error: (msg, data) => console.error(`[ERROR] ${msg}`, data)
 *   }
 * });
 *
 * console.log("结果:", result.output);
 * ```
 *
 * ### 示例 2: GPT 模型调用
 *
 * ```typescript
 * import { handler } from "texthelp-ai";
 *
 * const result = await handler({
 *   input: {
 *     api_url: "https://api.openai.com/v1",
 *     api_key: process.env.OPENAI_API_KEY,
 *     model: "gpt-4",
 *     user_prompt: "What is machine learning?",
 *     temperature: "0.8"
 *   },
 *   logger: console  // 也可以直接使用 console 对象
 * });
 *
 * return result;  // 返回给扣子
 * ```
 *
 * ### 示例 3: 动态参数调用
 *
 * ```typescript
 * import { handler } from "texthelp-ai";
 *
 * export default async function(input) {
 *   // input 来自扣子工作流
 *   const result = await handler({
 *     input: {
 *       api_url: input.api_url,
 *       api_key: input.api_key,
 *       model: input.model,
 *       user_prompt: input.user_prompt,
 *       system_prompt: input.system_prompt,
 *       temperature: input.temperature || "0.7",
 *       max_tokens: input.max_tokens || "2048"
 *     },
 *     logger: {
 *       debug: console.log,
 *       info: console.log,
 *       warn: console.warn,
 *       error: console.error
 *     }
 *   });
 *
 *   return result;
 * }
 * ```
 *
 * ### 示例 4: 错误处理
 *
 * ```typescript
 * import { handler } from "texthelp-ai";
 *
 * export default async function(input) {
 *   try {
 *     const result = await handler({
 *       input,
 *       logger: console
 *     });
 *
 *     // 检查是否有错误
 *     if (result.output.includes("关键参数缺失") ||
 *         result.output.includes("API 请求失败")) {
 *       return {
 *         success: false,
 *         error: result.output
 *       };
 *     }
 *
 *     return {
 *       success: true,
 *       content: result.output
 *     };
 *   } catch (error) {
 *     return {
 *       success: false,
 *       error: error.message
 *     };
 *   }
 * }
 * ```
 *
 * ## 步骤 4: 工作流示例
 *
 * ### 简单的问答流程
 *
 * ```
 * 用户输入
 *    ↓
 * [此工具] - 配置参数
 *    ↓
 * 输出结果到用户
 * ```
 *
 * 参数配置：
 * - api_url: 固定值 "https://api.anthropic.com"
 * - api_key: 环境变量 $ANTHROPIC_API_KEY
 * - model: 固定值 "claude-3-5-sonnet"
 * - user_prompt: 绑定到用户输入节点的输出
 * - system_prompt: 固定值 "你是一个有帮助的助手"
 *
 * ### 多模型选择流程
 *
 * ```
 * 用户选择模型
 *    ↓
 * 用户输入问题
 *    ↓
 * [条件判断] - 根据模型选择API
 *    ├─ Claude → [此工具(Claude配置)]
 *    └─ GPT → [此工具(GPT配置)]
 *    ↓
 * 输出结果
 * ```
 *
 * ## 步骤 5: 高级配置
 *
 * ### 使用环境变量存储敏感信息
 *
 * ```
 * api_key: $YOUR_API_KEY_ENV_NAME
 * api_url: $YOUR_API_URL_ENV_NAME
 * ```
 *
 * ### 动态模型切换
 *
 * 使用条件分支节点根据用户选择调用不同的工具配置
 *
 * ### 错误处理
 *
 * 使用扣子的"错误处理"功能捕获工具返回的错误消息：
 *
 * ```
 * if output.includes("关键参数缺失"):
 *   提示用户检查必填参数
 * else if output.includes("API 请求失败"):
 *   提示用户检查 API 密钥和 URL
 * else:
 *   显示 AI 的回复
 * ```
 *
 * ========================================
 * 常见问题
 * ========================================
 *
 * **Q: 工具如何知道使用哪种 API 格式？**
 * A: 工具会自动识别：
 *    - 模型名称中的 "claude" → Anthropic API
 *    - 模型名称中的 "gpt" → OpenAI API
 *    - URL 中的 "/messages" → Anthropic API
 *    - URL 中的 "/chat/completions" → OpenAI API
 *
 * **Q: 可以使用代理或第三方 API 吗？**
 * A: 可以！只需填写正确的 api_url 和 api_key，工具会自动识别格式
 *
 * **Q: 如何处理长文本输入？**
 * A: user_prompt 支持任意长度的文本，可以绑定到多行文本输入框
 *
 * **Q: 能同时调用多个 API 吗？**
 * A: 可以在工作流中多次使用此工具，配置不同的 API 信息即可
 *
 * **Q: 输出的文本太长了怎么办？**
 * A: 使用 max_tokens 参数限制输出长度，或在工作流中对输出进行截断
 */
