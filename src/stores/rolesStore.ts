import { getRoles } from "@/network/role/roleApi";
import { Role } from "@/network/role/types";
import { makeAutoObservable } from "mobx";

export class RolesStore {
  roles: Role[] = [];
  isLoading = false;
  error: Error | null = null;
  initialized = false;

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

  setInitialized(initialized: boolean) {
    this.initialized = initialized;
  }

  async fetchRoles(forceRefetch = false): Promise<Role[]> {
    if (this.roles.length > 0 && !forceRefetch && this.initialized) {
      return this.roles;
    }

    this.setLoading(true);
    this.setError(null);

    try {
      const roles = await getRoles();
      this.setRoles(roles);
      this.setInitialized(true);
      return roles;
    } catch (err) {
      this.setError(err as Error);
      throw err;
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
}

export const $rolesStore = new RolesStore();
