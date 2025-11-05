/**
 * TextHelp AI - Universal AI Model API Wrapper
 * 支持 OpenAI 和 Anthropic API 格式，智能选择最优的端点
 */

export { ApiType, detectApiType, normalizeApiUrl, isValidApiUrl, getOptimalApiType } from "./api/detector";
export { UnifiedRequest, transformRequest, buildHeaders } from "./api/transformer";
export { UnifiedResponse, extractContent, isValidResponse } from "./api/extractor";
export { TexthelpInput, TexthelpOutput, Args, Logger } from "./types";

import { Args, TexthelpInput, TexthelpOutput, Logger } from "./types";
import { detectApiType, normalizeApiUrl, isValidApiUrl, getOptimalApiType } from "./api/detector";
import { transformRequest, buildHeaders } from "./api/transformer";
import { extractContent } from "./api/extractor";

/**
 * 解析温度参数
 */
function parseTemperature(value: any): number {
  try {
    const temp = typeof value === "string" ? parseFloat(value) : (value ?? 0.7);
    if (isNaN(temp) || temp < 0 || temp > 2) {
      return 0.7;
    }
    return temp;
  } catch {
    return 0.7;
  }
}

/**
 * 解析最大令牌数
 */
function parseMaxTokens(value: any): number {
  try {
    const tokens = typeof value === "string" ? parseInt(value, 10) : (value ?? 20000000);
    if (isNaN(tokens) || tokens <= 0) {
      return 20000000;
    }
    return tokens;
  } catch {
    return 20000000;
  }
}

/**
 * 主处理函数 - 用于扣子平台或其他集成
 * @param args 包含输入参数和日志记录器的对象
 * @returns 返回处理结果
 */
export async function handler({ input, logger }: Args<TexthelpInput>): Promise<TexthelpOutput> {
  try {
    // ==================== 参数验证 ====================
    logger.debug("开始参数验证");

    if (!input.api_url || !input.api_key || !input.model || !input.user_prompt) {
      const errorMsg =
        "关键参数缺失: 'api_url', 'api_key', 'model', 'user_prompt' 都是必填项。";
      logger.error(errorMsg);
      return { output: errorMsg };
    }

    if (!isValidApiUrl(input.api_url)) {
      const errorMsg = `无效的 API URL: ${input.api_url}`;
      logger.error(errorMsg);
      return { output: errorMsg };
    }

    logger.info("参数验证成功", {
      model: input.model,
      has_system_prompt: !!input.system_prompt,
    });

    // ==================== API 类型检测和 URL 规范化 ====================
    logger.debug("检测 API 类型和规范化 URL");

    const apiType = detectApiType(input.api_url);
    const { url: normalizedUrl, detectedType: initialType } = normalizeApiUrl(
      input.api_url,
      apiType !== undefined ? apiType : undefined,
    );

    // 根据模型名称智能选择最优的 API 类型
    const optimizedApiType = getOptimalApiType(input.model, initialType);

    logger.info("API 类型检测完成", {
      initial_detected_type: initialType,
      optimized_api_type: optimizedApiType,
      model: input.model,
      normalized_url: normalizedUrl,
    });

    // ==================== 构建消息 ====================
    const messages: Array<{ role: "system" | "user"; content: string }> = [];

    if (input.system_prompt) {
      messages.push({
        role: "system",
        content: input.system_prompt,
      });
    }

    messages.push({
      role: "user",
      content: input.user_prompt,
    });

    // ==================== 解析参数 ====================
    const temperature = parseTemperature(input.temperature);
    const maxTokens = parseMaxTokens(input.max_tokens);

    logger.debug("参数解析完成", {
      temperature,
      max_tokens: maxTokens,
    });

    // ==================== 转换为目标 API 格式 ====================
    const transformedRequest = transformRequest(
      {
        model: input.model,
        messages,
        system: input.system_prompt,
        temperature,
        max_tokens: maxTokens,
      },
      optimizedApiType,
    );

    logger.debug("请求格式转换完成", {
      api_type: optimizedApiType,
    });

    // ==================== 构建请求头 ====================
    const headers = buildHeaders(input.api_key, optimizedApiType);

    logger.debug("请求头构建完成");

    // ==================== 发送请求 ====================
    logger.info("开始调用 AI API", {
      url: normalizedUrl,
      model: input.model,
      api_type: optimizedApiType,
    });

    const response = await fetch(normalizedUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(transformedRequest),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMsg = `API 请求失败: ${response.status} ${response.statusText}. 响应体: ${errorBody}`;
      logger.error(errorMsg);
      return { output: errorMsg };
    }

    const responseData = await response.json();
    logger.debug("成功获取 API 响应", { data: responseData });

    // ==================== 提取响应内容 ====================
    const extractedContent = extractContent(responseData, optimizedApiType);

    logger.info("成功提取响应内容", {
      content_length: extractedContent.content.length,
      usage: extractedContent.usage,
    });

    return { output: extractedContent.content };
  } catch (error) {
    const errorMsg = `请求过程中发生异常: ${
      error instanceof Error ? error.message : String(error)
    }`;
    logger.error(errorMsg, { error });
    return { output: errorMsg };
  }
}
