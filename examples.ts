/**
 * TextHelp AI - 扣子平台集成指南和使用示例
 *
 * 这是一个通用的 AI API 包装工具，支持 OpenAI 和 Anthropic 格式的 API。
 * 工具会根据模型名称自动识别 API 类型并进行格式转换。
 */

import { handler } from "texthelp-ai";

// ========================================
// 示例 1: 基础调用 (Claude)
// ========================================

async function example1() {
  const result = await handler({
    input: {
      api_url: "https://api.anthropic.com",
      api_key: "sk-ant-xxx...",
      model: "claude-3-5-sonnet",
      user_prompt: "写一个 Hello World 程序",
      system_prompt: "你是一个编程助手",
      temperature: "0.7",
      max_tokens: "2048",
    },
    logger: {
      debug: (msg, data) => console.log(`[DEBUG] ${msg}`, data),
      info: (msg, data) => console.log(`[INFO] ${msg}`, data),
      warn: (msg, data) => console.warn(`[WARN] ${msg}`, data),
      error: (msg, data) => console.error(`[ERROR] ${msg}`, data),
    },
  });

  console.log("结果:", result.output);
}

// ========================================
// 示例 2: GPT 模型调用
// ========================================

async function example2() {
  const result = await handler({
    input: {
      api_url: "https://api.openai.com/v1",
      api_key: process.env.OPENAI_API_KEY,
      model: "gpt-4",
      user_prompt: "What is machine learning?",
      temperature: "0.8",
    },
    logger: console,
  });

  console.log("结果:", result.output);
}

// ========================================
// 示例 3: 动态参数调用（用于扣子平台）
// ========================================

async function example3(input: any) {
  // input 来自扣子工作流
  const result = await handler({
    input: {
      api_url: input.api_url,
      api_key: input.api_key,
      model: input.model,
      user_prompt: input.user_prompt,
      system_prompt: input.system_prompt,
      temperature: input.temperature || "0.7",
      max_tokens: input.max_tokens || "2048",
    },
    logger: {
      debug: console.log,
      info: console.log,
      warn: console.warn,
      error: console.error,
    },
  });

  return result;
}

// ========================================
// 示例 4: 错误处理
// ========================================

async function example4(input: any) {
  try {
    const result = await handler({
      input,
      logger: console,
    });

    // 检查是否有错误
    if (
      result.output.includes("关键参数缺失") ||
      result.output.includes("API 请求失败")
    ) {
      return {
        success: false,
        error: result.output,
      };
    }

    return {
      success: true,
      content: result.output,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// ========================================
// 示例 5: 代理 API 调用
// ========================================

async function example5() {
  const result = await handler({
    input: {
      api_url: "https://api-proxy.example.com/v1",
      api_key: "your-proxy-key",
      model: "claude-3-haiku-4-5",
      user_prompt: "你好，请介绍一下自己",
      temperature: "0.6",
      max_tokens: "1024",
    },
    logger: console,
  });

  console.log("结果:", result.output);
}

// ========================================
// 如何在扣子平台中使用
// ========================================

/**
 * 在扣子平台中创建工具时，使用以下代码：
 *
 * export default handler;
 *
 * 扣子平台会自动提供 input 和 logger 参数，你只需要导出 handler 函数。
 *
 * 元数据配置：
 *
 * 输入参数：
 * - api_url (string, 必填): AI API 的 URL
 * - api_key (string, 必填): API 密钥
 * - model (string, 必填): 模型名称
 * - user_prompt (string, 必填): 用户提示词
 * - system_prompt (string, 可选): 系统提示词
 * - temperature (number, 可选): 温度参数 (0-2)
 * - max_tokens (number, 可选): 最大令牌数
 *
 * 输出参数：
 * - output (string): AI 生成的文本内容
 *
 * 工具特性：
 * - 自动识别 API 类型（Claude → Anthropic，GPT → OpenAI）
 * - 自动补全不完整的 URL
 * - 支持代理 API 服务
 * - 统一的错误处理
 */

// ========================================
// 运行示例（如果直接执行此文件）
// ========================================

async function runExamples() {
  console.log("运行示例...\n");

  // 取消注释下面的示例来运行它们
  // await example1();
  // await example2();
  // await example5();
}

// 如果直接运行此文件
if (require.main === module) {
  runExamples().catch(console.error);
}

// 导出示例函数供其他模块使用
export { example1, example2, example3, example4, example5 };

// 扣子平台会自动调用这个 handler 函数
export default handler;
