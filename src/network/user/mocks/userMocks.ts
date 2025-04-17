import { validateResponse } from "@/utils/validateResponse";
import { RawUser, User } from "../types";
import { adaptUser } from "../userAdapter";
import userData from "./user.mock.json";
import { UserSchema } from "./user.mock.schema";
import usersData from "./users.mock.json";
import { UsersSchema } from "./users.mock.schema";

const mockUsersMap: Record<number, RawUser> = {};
usersData.forEach((user) => {
  mockUsersMap[user.id] = user;
});

export async function mockFetchUser(userId: number): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (userId === 1) {
    const validatedUser = validateResponse(userData, UserSchema);
    return adaptUser(validatedUser);
  }

  if (mockUsersMap[userId]) {
    const validatedUser = validateResponse(mockUsersMap[userId], UserSchema);
    return adaptUser(validatedUser);
  }

  throw new Error(`User with ID ${userId} not found`);
}

export async function mockFetchUsers(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const validatedUsers = validateResponse(usersData, UsersSchema);
  return validatedUsers.map(adaptUser);
}
