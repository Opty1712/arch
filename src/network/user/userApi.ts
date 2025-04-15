import { User } from "./types";
import { mockFetchUser } from "./userMocks";

export async function fetchUserAPI(userId: number): Promise<User> {
  return mockFetchUser(userId);
}

export async function fetchUsers(): Promise<User[]> {
  const mockUsers = await Promise.all([
    mockFetchUser(1),
    mockFetchUser(2),
    mockFetchUser(3),
  ]);
  return mockUsers;
}

export async function updateUserRoles(
  userId: number,
  roleIds: number[]
): Promise<User> {
  console.log("Updating user roles:", userId, roleIds);
  const user = await mockFetchUser(userId);
  user.roleIds = roleIds;
  return user;
}
