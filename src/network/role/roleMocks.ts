import { adaptRoles } from "./roleAdapter";
import { Role } from "./types";

const mockRoles = [
  {
    id: 1,
    name: "администратор",
    description: "Полный доступ ко всем функциям системы",
  },
  {
    id: 2,
    name: "модератор",
    description: "Доступ к управлению контентом",
  },
  {
    id: 3,
    name: "пользователь",
    description: "Базовый доступ к функциям системы",
  },
];

export async function mockFetchRoles(): Promise<Role[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return adaptRoles(mockRoles);
}