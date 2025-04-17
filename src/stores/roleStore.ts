import { appConfig } from "@/config/appConfig";
import { getRoles } from "@/network/role/roleApi";
import { Role } from "@/network/role/types";
import { makeAutoObservable } from "mobx";

export class RoleStore {
  roles: Role[] = [];
  isLoading = false;
  error: Error | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setRoles(roles: Role[]) {
    this.roles = roles;
  }

  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setError(error: Error | null) {
    this.error = error;
  }

  async fetchRoles(forceRefetch = false): Promise<void> {
    if (appConfig.IS_STORYBOOK) {
      return;
    }

    if (this.roles.length > 0 && !forceRefetch) {
      return;
    }

    this.setLoading(true);
    this.setError(null);

    try {
      const roles = await getRoles();
      this.setRoles(roles);
    } catch (err) {
      this.setError(err as Error);
    } finally {
      this.setLoading(false);
    }
  }

  getRoleById(id: number): Role | undefined {
    return this.roles.find((role) => role.id === id);
  }

  getRolesByIds(ids: number[]): Role[] {
    return this.roles.filter((role) => ids.includes(role.id));
  }

  reset() {
    this.roles = [];
    this.error = null;
  }
}

export const $roleStore = new RoleStore();
