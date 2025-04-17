import { appConfig } from "@/config/appConfig";
import { User } from "@/network/currentUser/types";
import { getUsers, updateUserRoles } from "@/network/users/usersApi";
import { makeAutoObservable } from "mobx";
import { $usersStore } from "./usersStore";

class RolesPageStore {
  users: User[] = [];

  isLoading = false;

  error: Error | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUsers(users: User[]) {
    this.users = users;
  }

  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setError(error: Error | null) {
    this.error = error;
  }

  async fetchUsers(): Promise<void> {
    if (appConfig.IS_STORYBOOK) {
      return;
    }

    this.setLoading(true);
    this.setError(null);

    try {
      const users = await getUsers();
      this.setUsers(users);
    } catch (err) {
      this.setError(err as Error);
    } finally {
      this.setLoading(false);
    }
  }

  async updateUserRoles(userId: number, roleIds: number[]): Promise<void> {
    if (appConfig.IS_STORYBOOK) {
      return;
    }

    try {
      const updatedUser = await updateUserRoles(userId, roleIds);

      this.setUsers(
        this.users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );

      if ($usersStore.currentUser && $usersStore.currentUser.id === userId) {
        $usersStore.setCurrentUser(updatedUser);
      }
    } catch (err) {
      console.error("Failed to update user roles:", err);
      this.setError(err as Error);
    }
  }
}

export const $rolesPageStore = new RolesPageStore();
