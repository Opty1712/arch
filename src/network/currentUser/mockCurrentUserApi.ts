import { validateResponse } from "@/network/validateResponse";
import { adaptUser } from "./adaptUser";
import currentUserData from "./mocks/currentUser.mock.json";
import { CurrentUserSchema } from "./mocks/currentUser.mock.schema";
import { User } from "./types";

export async function mockCurrentUserApi(): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const token = localStorage.getItem("auth_token");
  if (!token) return null;

  const validatedUser = validateResponse(currentUserData, CurrentUserSchema);
  return adaptUser(validatedUser);
}

export async function mockUpdateCurrentUser(profileData: {
  name?: string;
  email?: string;
}): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const updatedUser = {
    ...currentUserData,
    ...profileData,
  };

  const validatedUser = validateResponse(updatedUser, CurrentUserSchema);
  return adaptUser(validatedUser);
}
