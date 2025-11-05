/**
 * API 响应提取器
 * 从不同 API 的响应中统一提取内容
 */

import { ApiType } from "./detector";

export interface UnifiedResponse {
  content: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
}

/**
 * 从 OpenAI 格式响应提取内容
 */
function extractFromOpenAIResponse(response: any): UnifiedResponse {
  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(
      "无法从 OpenAI 响应中提取内容: choices[0].message.content 不存在"
    );
  }

  return {
    content,
    usage: {
      input_tokens: response.usage?.prompt_tokens,
      output_tokens: response.usage?.completion_tokens,
    },
  };
}

/**
 * 从 Anthropic Messages 格式响应提取内容
 */
function extractFromAnthropicResponse(response: any): UnifiedResponse {
  const content = response.content?.[0]?.text;

  if (!content) {
    throw new Error(
      "无法从 Anthropic 响应中提取内容: content[0].text 不存在"
    );
  }

  return {
    content,
    usage: {
      input_tokens: response.usage?.input_tokens,
      output_tokens: response.usage?.output_tokens,
    },
  };
}

/**
 * 从特定格式的响应中提取统一格式的内容
 */
export function extractContent(
  response: any,
  apiType: ApiType,
): UnifiedResponse {
  switch (apiType) {
    case ApiType.OPENAI_COMPATIBLE:
      return extractFromOpenAIResponse(response);

    case ApiType.ANTHROPIC_MESSAGES:
      return extractFromAnthropicResponse(response);

    default:
      // 尝试两种格式
      try {
        return extractFromOpenAIResponse(response);
      } catch {
        return extractFromAnthropicResponse(response);
      }
  }
}

/**
 * 验证响应是否有效
 */
export function isValidResponse(response: any, apiType: ApiType): boolean {
  try {
    extractContent(response, apiType);
    return true;
  } catch {
    return false;
  }
}
