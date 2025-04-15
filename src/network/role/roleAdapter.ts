import { Role } from "./types";

export function adaptRoles(rawRoles: any[]): Role[] {
  if (!Array.isArray(rawRoles)) {
    return [];
  }

  return rawRoles.map((rawRole) => ({
    id: rawRole.id,
    name: capitalizeFirstLetter(rawRole.name),
    description: rawRole.description,
  }));
}

function capitalizeFirstLetter(str: string): string {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
