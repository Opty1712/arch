import { z } from "zod";

/**
 * Валидирует ответ от сервера по заданной Zod-схеме
 * @param data Данные для валидации
 * @param schema Zod-схема для валидации
 * @returns Валидированные данные, соответствующие схеме
 * @throws Error если данные не проходят валидацию
 */
export function validateResponse<T>(data: unknown, schema: z.ZodType<T>): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.error("Validation error:", result.error);
    throw new Error(`API Response validation failed: ${result.error.message}`);
  }

  return result.data;
}
