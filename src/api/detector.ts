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
 * 支持基于模型名称的智能 API 类型判断
 *
 * @param url API 端点 URL
 * @param apiType 显式指定的 API 类型（可选）
 * @param model 模型名称，用于智能判断 API 类型（可选）
 */
export function normalizeApiUrl(
  url: string,
  apiType?: ApiType,
  model?: string,
): { url: string; detectedType: ApiType } {
  let normalized = url.trim().replace(/\/$/, "");

  // 步骤 1: 检测 URL 中明确的 API 类型标记
  let finalApiType = apiType || detectApiType(normalized);

  // 步骤 2: 如果 URL 中没有明确的 API 标记，根据模型名称智能判断
  if (finalApiType === ApiType.UNKNOWN && model) {
    const optimalType = getOptimalApiType(model, ApiType.UNKNOWN);
    if (optimalType !== ApiType.UNKNOWN) {
      finalApiType = optimalType;
    }
  }

  // 步骤 3: 如果还是无法识别，尝试自动补全常见的格式
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
    // 根据确定的类型补全 URL（确保 URL 中包含必要的路径）
    switch (finalApiType) {
      case ApiType.ANTHROPIC_MESSAGES:
        // 确保 URL 包含 /v1 和 /messages
        if (!normalized.includes("/v1")) {
          normalized += "/v1";
        }
        if (!normalized.includes("/messages")) {
          normalized += "/messages";
        }
        break;

      case ApiType.OPENAI_COMPATIBLE:
        // 确保 URL 包含 /v1 和 /chat/completions
        if (!normalized.includes("/v1")) {
          normalized += "/v1";
        }
        if (!normalized.includes("/chat/completions")) {
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
