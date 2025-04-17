import { validateResponse } from "@/utils/validateResponse";
import { AuthResponse } from "../types";
import authData from "./auth.mock.json";
import { AuthSchema } from "./auth.mock.schema";

export async function mockLogin(username: string): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Используем мок данные из JSON файла
  // Валидируем данные перед возвратом
  const validatedAuth = validateResponse(authData, AuthSchema);

  return {
    token: validatedAuth.token,
    user: {
      ...validatedAuth.user,
      // Если username не demo, можно изменить имя для разных сценариев
      name:
        username !== "demo"
          ? `${username.charAt(0).toUpperCase()}${username.slice(1)}`
          : validatedAuth.user.name,
    },
  };
}
