/**
 * API 请求转换器
 * 将统一的内部格式转换为不同 API 的请求格式
 */

import { ApiType } from "./detector";

export interface UnifiedRequest {
  model: string;
  messages: Array<{ role: "user" | "system"; content: string }>;
  system?: string;
  temperature?: number;
  max_tokens?: number;
}

/**
 * 转换为 OpenAI 兼容格式的请求
 */
function transformToOpenAIFormat(unified: UnifiedRequest): any {
  const messages: any[] = [];

  // system 消息放在最前面
  if (unified.system) {
    messages.push({
      role: "system",
      content: unified.system,
    });
  }

  // 添加用户消息
  messages.push(...unified.messages);

  return {
    model: unified.model,
    messages,
    temperature: unified.temperature ?? 0.7,
    max_tokens: unified.max_tokens ?? 1024,
    stream: false,
  };
}

/**
 * 转换为 Anthropic Messages 格式的请求
 */
function transformToAnthropicFormat(unified: UnifiedRequest): any {
  return {
    model: unified.model,
    messages: unified.messages,
    system: unified.system || undefined,
    temperature: unified.temperature ?? 0.7,
    max_tokens: unified.max_tokens ?? 1024,
  };
}

/**
 * 转换为特定 API 格式的请求
 */
export function transformRequest(
  unified: UnifiedRequest,
  apiType: ApiType,
): any {
  switch (apiType) {
    case ApiType.OPENAI_COMPATIBLE:
      return transformToOpenAIFormat(unified);

    case ApiType.ANTHROPIC_MESSAGES:
      return transformToAnthropicFormat(unified);

    default:
      // 默认使用 OpenAI 格式
      return transformToOpenAIFormat(unified);
  }
}

/**
 * 构建请求头
 */
export function buildHeaders(
  apiKey: string,
  apiType: ApiType,
  customHeaders?: Record<string, string>,
): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    ...customHeaders,
  };

  // 某些 API 可能需要特殊的请求头
  switch (apiType) {
    case ApiType.ANTHROPIC_MESSAGES:
      headers["anthropic-version"] = "2023-06-01";
      break;
  }

  return headers;
}
