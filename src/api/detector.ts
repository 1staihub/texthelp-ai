/**
 * API 类型检测和规范化
 * 支持多种大模型 API 格式的自动识别和处理
 */

export enum ApiType {
  OPENAI_COMPATIBLE = "openai-compatible",
  ANTHROPIC_MESSAGES = "anthropic-messages",
  UNKNOWN = "unknown",
}

/**
 * 根据 URL 检测 API 类型
 */
export function detectApiType(apiUrl: string): ApiType {
  const url = apiUrl.toLowerCase().trim();

  // Anthropic Messages API
  if (url.includes("/messages")) {
    return ApiType.ANTHROPIC_MESSAGES;
  }

  // OpenAI 兼容 API
  if (url.includes("/chat/completions") || url.includes("/completions")) {
    return ApiType.OPENAI_COMPATIBLE;
  }

  return ApiType.UNKNOWN;
}

/**
 * 根据模型名称判断最适合的 API 类型
 * 不同的模型可能需要不同的 API 格式
 */
export function getOptimalApiType(
  model: string,
  detectedType: ApiType,
): ApiType {
  const modelLower = model.toLowerCase();

  // Claude 系列模型 → 使用 Anthropic Messages 格式
  if (modelLower.includes("claude")) {
    return ApiType.ANTHROPIC_MESSAGES;
  }

  // GPT 系列模型 → 使用 OpenAI 兼容格式
  if (modelLower.includes("gpt")) {
    return ApiType.OPENAI_COMPATIBLE;
  }

  // Gemini 系列模型 → 使用 OpenAI 兼容格式
  if (modelLower.includes("gemini")) {
    return ApiType.OPENAI_COMPATIBLE;
  }

  // Llama 系列模型 → 使用 OpenAI 兼容格式
  if (modelLower.includes("llama")) {
    return ApiType.OPENAI_COMPATIBLE;
  }

  // 默认使用检测到的类型
  return detectedType;
}

/**
 * 规范化 API URL 到完整端点
 */
export function normalizeApiUrl(
  url: string,
  apiType?: ApiType,
): { url: string; detectedType: ApiType } {
  let normalized = url.trim().replace(/\/$/, "");

  // 如果没有指定类型，先尝试检测
  let finalApiType = apiType || detectApiType(normalized);

  // 如果还是无法识别，尝试自动补全常见的格式
  if (finalApiType === ApiType.UNKNOWN) {
    // 如果 URL 以 /v1 结尾，优先尝试 Anthropic 格式
    if (normalized.endsWith("/v1")) {
      // 首选 Anthropic Messages（更通用）
      finalApiType = ApiType.ANTHROPIC_MESSAGES;
      normalized += "/messages";
    } else {
      // 次选 OpenAI 格式
      finalApiType = ApiType.OPENAI_COMPATIBLE;
      if (!normalized.includes("/chat/completions")) {
        normalized += "/chat/completions";
      }
    }
  } else {
    // 根据检测到的类型补全 URL
    switch (finalApiType) {
      case ApiType.ANTHROPIC_MESSAGES:
        if (normalized.endsWith("/v1")) {
          normalized += "/messages";
        }
        break;

      case ApiType.OPENAI_COMPATIBLE:
        if (normalized.endsWith("/v1")) {
          normalized += "/chat/completions";
        }
        break;
    }
  }

  return {
    url: normalized,
    detectedType: finalApiType,
  };
}

/**
 * 验证 API URL 是否有效
 */
export function isValidApiUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
