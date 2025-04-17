import {
  logout as apiLogout,
  fetchCurrentUser,
  login,
} from "@/network/auth/authApi";
import { User } from "@/network/user/types";
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
        // Если данные пользователя не получены, очищаем токен
        localStorage.removeItem("auth_token");
        this.setUser(null);
      }
    } catch (error) {
      console.error("Failed to init user:", error);
      // При ошибке также очищаем токен
      localStorage.removeItem("auth_token");
      this.setUser(null);
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
      localStorage.removeItem("auth_token");
      this.setUser(null);
      // Сбрасываем состояние roleStore
      $roleStore.reset();
      // Принудительно перезагружаем страницу для сброса всех данных
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      // Даже при ошибке удаляем токен и сбрасываем пользователя
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
