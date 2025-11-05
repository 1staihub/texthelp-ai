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
    max_tokens: unified.max_tokens ?? 32000,
    stream: false,
  };
}

/**
 * 转换为 Anthropic Messages 格式的请求
 * Anthropic API 要求 content 是对象数组,而不是字符串
 */
function transformToAnthropicFormat(unified: UnifiedRequest): any {
  // 转换 messages 格式:将 content 字符串转换为对象数组
  const messages = unified.messages.map((msg) => ({
    role: msg.role,
    content: [
      {
        type: "text",
        text: msg.content,
      },
    ],
  }));

  return {
    model: unified.model,
    messages,
    system: unified.system || undefined,
    temperature: unified.temperature ?? 0.7,
    max_tokens: unified.max_tokens ?? 1024,
    stream: true, // Anthropic 代理需要 stream: true
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
 * 支持不同 API 的认证方式:
 * - OpenAI: Authorization: Bearer <key>
 * - Anthropic: x-api-key: <key> (代理方式) 或 Authorization: Bearer <key> (官方 API)
 */
export function buildHeaders(
  apiKey: string,
  apiType: ApiType,
  customHeaders?: Record<string, string>,
): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  // 某些 API 可能需要特殊的请求头
  switch (apiType) {
    case ApiType.ANTHROPIC_MESSAGES:
      // Anthropic 代理通常使用 x-api-key 头
      // 如果是代理服务(检测 API Key 格式),使用 x-api-key
      // 否则使用标准的 Authorization 头
      if (apiKey.startsWith("sk-")) {
        // 代理格式的 key,使用 x-api-key
        headers["x-api-key"] = apiKey;
      } else {
        // 官方 API key,使用 Authorization
        headers["Authorization"] = `Bearer ${apiKey}`;
      }
      headers["anthropic-version"] = "2023-06-01";
      break;

    case ApiType.OPENAI_COMPATIBLE:
      // OpenAI 使用标准 Authorization 头
      headers["Authorization"] = `Bearer ${apiKey}`;
      break;

    default:
      headers["Authorization"] = `Bearer ${apiKey}`;
      break;
  }

  return headers;
}
