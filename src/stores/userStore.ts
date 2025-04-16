import { appConfig } from "@/config/appConfig";
import {
  logout as apiLogout,
  fetchCurrentUser,
  login,
} from "@/network/auth/authApi";
import { User } from "@/network/user/types";
import { makeAutoObservable } from "mobx";

export class UserStore {
  user: User | null = null;
  isAuthenticated = false;
  isMockMode = appConfig.IS_MOCK_MODE;
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
    try {
      const authData = await fetchCurrentUser();
      if (authData && authData.user) {
        this.setUser(authData.user);
      }
    } catch (error) {
      console.error("Failed to init user:", error);
    }
  }

  async login(username: string): Promise<void> {
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
    this.setLoading(true);
    try {
      await apiLogout();
      this.setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.setLoading(false);
    }
  }
}

export const $userStore = new UserStore();
