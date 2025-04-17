import { RawUser, User } from "./types";

export function adaptUser(rawUser: RawUser): User {
  return {
    id: rawUser.id,
    name: rawUser.name.trim(),
    email: rawUser.email.toLowerCase(),
    roleIds: rawUser.roleIds || [],
  };
}
