import { appConfig } from "@/config/appConfig";
import {
  logout as apiLogout,
  fetchCurrentUser,
  login,
} from "@/network/auth/authApi";
import { User } from "@/network/currentUser/types";
import { makeAutoObservable } from "mobx";
import { $roleStore } from "./roleStore";

export class UserStore {
  user: User | null = null;
  isAuthenticated = false;
  isLoading = false;
  error: Error | null = null;

  constructor() {
    makeAutoObservable(this);
    this.initFromStorage();
  }

  setUser(user: User | null) {
    this.user = user;
    this.isAuthenticated = !!user;
  }

  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setError(error: Error | null) {
    this.error = error;
  }

  async initFromStorage(): Promise<void> {
    if (appConfig.IS_STORYBOOK) {
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        this.setUser(null);
        return;
      }

      const authData = await fetchCurrentUser();
      if (authData && authData.user) {
        this.setUser(authData.user);
      } else {
        localStorage.removeItem("auth_token");
        this.setUser(null);
      }
    } catch (error) {
      console.error("Failed to init user:", error);
      localStorage.removeItem("auth_token");
      this.setUser(null);
    }
  }

  async login(username: string): Promise<void> {
    if (appConfig.IS_STORYBOOK) {
      return;
    }

    this.setLoading(true);
    this.setError(null);

    try {
      const response = await login(username);
      if (response.user) {
        this.setUser(response.user);
      }
    } catch (err) {
      this.setError(err as Error);
      throw err;
    } finally {
      this.setLoading(false);
    }
  }

  async logout(): Promise<void> {
    if (appConfig.IS_STORYBOOK) {
      return;
    }

    this.setLoading(true);
    try {
      await apiLogout();
      localStorage.removeItem("auth_token");
      this.setUser(null);
      $roleStore.reset();
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("auth_token");
      this.setUser(null);
      $roleStore.reset();
      window.location.reload();
    } finally {
      this.setLoading(false);
    }
  }
}

export const $userStore = new UserStore();
