/**
 * 扣子平台集成类型定义
 */

/**
 * 工具输入参数接口
 */
export interface TexthelpInput {
  api_url: string;
  api_key: string;
  model: string;
  user_prompt: string;
  system_prompt?: string;
  temperature?: string | number;
  max_tokens?: string | number;
  custom_headers?: Record<string, string>;
}

/**
 * 工具输出接口
 */
export interface TexthelpOutput {
  output: string;
}

/**
 * 扣子平台工具处理函数参数
 */
export interface Args<T> {
  input: T;
  logger: Logger;
}

/**
 * 日志记录接口
 */
export interface Logger {
  debug(message: string, metadata?: Record<string, any>): void;
  info(message: string, metadata?: Record<string, any>): void;
  warn(message: string, metadata?: Record<string, any>): void;
  error(message: string, metadata?: Record<string, any>): void;
}
