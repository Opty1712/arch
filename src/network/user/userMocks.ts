import { User } from "./types";

const mockUsers: Record<number, User> = {
  1: {
    id: 1,
    name: "Иван Петров",
    email: "ivan.petrov@example.com",
    roleIds: [1, 3],
  },
  2: {
    id: 2,
    name: "Мария Сидорова",
    email: "maria.sidorova@example.com",
    roleIds: [2, 3],
  },
  3: {
    id: 3,
    name: "Алексей Николаев",
    email: "alexey.nikolaev@example.com",
    roleIds: [3],
  },
};

export async function mockFetchUser(userId: number): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (mockUsers[userId]) {
    return { ...mockUsers[userId] };
  }

  throw new Error(`User with ID ${userId} not found`);
}
