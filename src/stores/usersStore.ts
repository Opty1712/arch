import { appConfig } from "@/config/appConfig";
import { User } from "@/network/user/types";
import {
  updateUserRoles as apiUpdateUserRoles,
  getUser,
} from "@/network/user/userApi";
import { makeAutoObservable } from "mobx";

class UsersStore {
  currentUser: User | null = null;

  isLoading = false;

  error: Error | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setCurrentUser(user: User | null) {
    this.currentUser = user;
  }

  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setError(error: Error | null) {
    this.error = error;
  }

  async fetchUserById(userId: number): Promise<void> {
    if (appConfig.IS_STORYBOOK) {
      return;
    }

    this.setLoading(true);
    this.setError(null);

    try {
      const userData = await getUser(userId);
      this.setCurrentUser(userData);
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
      const updatedUser = await apiUpdateUserRoles(userId, roleIds);
      this.setCurrentUser(updatedUser);
    } catch (err) {
      console.error("Failed to update user roles:", err);
      this.setError(err as Error);
    }
  }
}

export const $usersStore = new UsersStore();
