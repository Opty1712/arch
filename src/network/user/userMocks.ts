import { adaptUser } from "./userAdapter";
import { RawUser, User } from "./types";

const mockUsers: Record<number, RawUser> = {
  1: {
    id: 1,
    name: "Иван Петров ",
    email: "IVAN.PETROV@example.com",
    roleIds: [1, 3],
  },
  2: {
    id: 2,
    name: " Мария Сидорова",
    email: "MARIA.SIDOROVA@example.com",
    roleIds: [2, 3],
  },
  3: {
    id: 3,
    name: "Алексей Николаев ",
    email: "ALEXEY.NIKOLAEV@example.com",
    roleIds: [3],
  },
};

export async function mockFetchUser(userId: number): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (mockUsers[userId]) {
    return adaptUser(mockUsers[userId]);
  }

  throw new Error(`User with ID ${userId} not found`);
}