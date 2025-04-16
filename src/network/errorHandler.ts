import { WretchError } from "wretch";

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "ApiError";
  }
}

export const handleApiError = (error: WretchError): ApiError => {
  if (error.status === 401) {
  }

  let message = "Неизвестная ошибка";
  let code = "UNKNOWN_ERROR";

  if (error.json) {
    const response = error.json;
    message = response.error?.message || message;
    code = response.error?.code || code;
  }

  return new ApiError(message, error.status, code);
};
