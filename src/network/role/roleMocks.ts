import { Role } from "./types";

const mockRoles: Role[] = [
  {
    id: 1,
    name: "Администратор",
    description: "Полный доступ ко всем функциям системы",
  },
  {
    id: 2,
    name: "Модератор",
    description: "Доступ к управлению контентом",
  },
  {
    id: 3,
    name: "Пользователь",
    description: "Базовый доступ к функциям системы",
  },
];

export async function mockFetchRoles(): Promise<Role[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [...mockRoles];
}
