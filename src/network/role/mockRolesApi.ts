import { validateResponse } from "@/network/validateResponse";
import { adaptRoles } from "./adaptRoles";
import rolesData from "./mocks/roles.mock.json";
import { RolesSchema } from "./mocks/roles.mock.schema";
import { Role } from "./types";

export async function mockRolesApi(): Promise<Role[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const validatedRoles = validateResponse(rolesData, RolesSchema);
  return adaptRoles(validatedRoles);
}
