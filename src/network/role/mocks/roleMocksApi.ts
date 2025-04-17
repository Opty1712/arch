import { validateResponse } from "@/utils/validateResponse";
import { adaptRoles } from "../roleAdapter";
import { Role } from "../types";
import rolesData from "./roles.mock.json";
import { RolesSchema } from "./roles.mock.schema";

export async function mockFetchRoles(): Promise<Role[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const validatedRoles = validateResponse(rolesData, RolesSchema);
  return adaptRoles(validatedRoles);
}
