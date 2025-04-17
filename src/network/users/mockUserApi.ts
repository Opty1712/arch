import { validateResponse } from "@/utils/validateResponse";
import { adaptUser } from "./adaptUser";
import userData from "./mocks/user.mock.json";
import { UserSchema } from "./mocks/user.mock.schema";
import usersData from "./mocks/users.mock.json";
import { UsersSchema } from "./mocks/users.mock.schema";
import { RawUser, User } from "./types";

const mockUsersMap: Record<number, RawUser> = {};
usersData.forEach((user) => {
  mockUsersMap[user.id] = user;
});

export async function mockUserApi(userId: number): Promise<User> {
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

export async function mockUsersApi(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const validatedUsers = validateResponse(usersData, UsersSchema);
  return validatedUsers.map(adaptUser);
}
