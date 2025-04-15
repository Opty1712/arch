import { appConfig } from "@/config/appConfig";
import { makeAutoObservable } from "mobx";
import { fetchRolesAPI } from "../network/role/roleApi";
import { Role } from "../network/role/types";

class RoleStore {
  roles: Role[] = [];

  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   */
  async fetchRoles() {
    if (this.roles.length > 0 || appConfig.isDemo) {
      return this.roles;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const roles = await fetchRolesAPI();
      this.roles = roles;
      return roles;
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
      console.error("Fetch roles error:", err);
      throw err;
    } finally {
      this.isLoading = false;
    }
  }

  getRole(roleId: number): Role | undefined {
    return this.roles.find((role) => role.id === roleId);
  }

  getRoleNamesByIds(roleIds: number[]): string[] {
    return roleIds
      .map((id) => this.getRole(id))
      .filter((role): role is Role => role !== undefined)
      .map((role) => role.name);
  }
}

export const roleStore = new RoleStore();
