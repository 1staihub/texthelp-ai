/**
 * texthelp-ai 使用示例
 */

import {
  handler,
  detectApiType,
  getOptimalApiType,
  normalizeApiUrl,
  transformRequest,
  buildHeaders,
  extractContent,
} from "./src/index";

// 示例 1: 在扣子平台中使用
// =====================================================

// 扣子平台会自动调用这个 handler
export default handler;

// 示例 2: 独立使用
// =====================================================

// 创建一个简单的日志记录器
const logger = {
  debug: (msg: string, data?: any) => console.log(`[DEBUG] ${msg}`, data || ""),
  info: (msg: string, data?: any) => console.log(`[INFO] ${msg}`, data || ""),
  warn: (msg: string, data?: any) => console.warn(`[WARN] ${msg}`, data || ""),
  error: (msg: string, data?: any) =>
    console.error(`[ERROR] ${msg}`, data || ""),
};

async function example1() {
  console.log("=== 示例 1: 使用 Claude 模型 ===\n");

  const result = await handler({
    input: {
      api_url: "https://api.anthropic.com",
      api_key: process.env.ANTHROPIC_API_KEY || "sk-xxx",
      model: "claude-3-5-sonnet",
      user_prompt: "写一个 Hello World 程序",
      system_prompt: "你是一个编程助手，用中文回答问题",
      temperature: "0.7",
      max_tokens: "1024",
    },
    logger,
  });

  console.log("结果:", result.output);
  console.log();
}

async function example2() {
  console.log("=== 示例 2: 使用 OpenAI GPT 模型 ===\n");

  const result = await handler({
    input: {
      api_url: "https://api.openai.com/v1",
      api_key: process.env.OPENAI_API_KEY || "sk-xxx",
      model: "gpt-4",
      user_prompt: "What is the capital of France?",
      system_prompt: "You are a helpful assistant.",
      temperature: "0.5",
      max_tokens: "500",
    },
    logger,
  });

  console.log("结果:", result.output);
  console.log();
}

async function example3() {
  console.log("=== 示例 3: 使用代理 API 服务 ===\n");

  const result = await handler({
    input: {
      api_url: "https://api-proxy.example.com/v1", // 不完整的 URL
      api_key: "sk-proxy-key",
      model: "claude-3-haiku", // 自动识别为 Anthropic 格式
      user_prompt: "你好，请介绍一下自己",
      temperature: "0.8",
      max_tokens: "2048",
    },
    logger,
  });

  console.log("结果:", result.output);
  console.log();
}

async function example4() {
  console.log("=== 示例 4: 模块化使用 ===\n");

  // 检测 API 类型
  const apiType = detectApiType("https://api.example.com/v1/messages");
  console.log("检测到的 API 类型:", apiType);

  // 根据模型获取最优类型
  const optimalType = getOptimalApiType("claude-3-5-sonnet", apiType);
  console.log("最优 API 类型:", optimalType);

  // 规范化 URL
  const { url, detectedType } = normalizeApiUrl(
    "https://api.example.com/v1",
    optimalType,
  );
  console.log("规范化后的 URL:", url);

  // 转换请求
  const requestBody = transformRequest(
    {
      model: "claude-3-5-sonnet",
      messages: [{ role: "user", content: "Hello" }],
      temperature: 0.7,
      max_tokens: 1024,
    },
    detectedType,
  );
  console.log("转换后的请求体:", JSON.stringify(requestBody, null, 2));

  // 构建请求头
  const headers = buildHeaders("sk-xxx", detectedType);
  console.log("请求头:", headers);

  // 模拟 API 响应提取
  const mockResponse = {
    content: [{ type: "text", text: "Hello! How can I help?" }],
    usage: { input_tokens: 10, output_tokens: 20 },
  };

  const { content, usage } = extractContent(mockResponse, detectedType);
  console.log("提取的内容:", content);
  console.log("使用量:", usage);
  console.log();
}

async function example5() {
  console.log("=== 示例 5: 错误处理 ===\n");

  // 缺少必填参数
  const result1 = await handler({
    input: {
      api_url: "", // 空 URL
      api_key: "sk-xxx",
      model: "gpt-4",
      user_prompt: "Hello",
    },
    logger,
  });

  if (result1.output.includes("关键参数缺失")) {
    console.log("✓ 正确捕获参数缺失错误");
  }
  console.log();
}

// 运行示例
async function runExamples() {
  try {
    await example1();
    await example2();
    await example3();
    await example4();
    await example5();
  } catch (error) {
    console.error("执行示例出错:", error);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  runExamples();
}

export { example1, example2, example3, example4, example5 };
