import { mockFetchRoles } from "./roleMocks";
import { Role } from "./types";

export async function fetchRolesAPI(): Promise<Role[]> {
  return mockFetchRoles();
}
