import { makeAutoObservable } from "mobx";
import { login as apiLogin } from "../network/auth/authApi";
import { User } from "../network/user/types";
import { fetchUserAPI, updateUserRoles } from "../network/user/userApi";

class UserStore {
  user: User | null = null;
  isAuthenticated = false;

  isLoading = false;
  error: string | null = null;

  isDemoMode = true;

  constructor() {
    makeAutoObservable(this);
  }

  async login(username: string) {
    if (!username?.trim()) return;

    this.isLoading = true;
    this.error = null;

    try {
      const authResponse = await apiLogin(username);
      this.user = authResponse.user;
      this.isAuthenticated = true;

      localStorage.setItem("auth_token", authResponse.token);
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
      console.error("Login error:", err);
    } finally {
      this.isLoading = false;
    }
  }

  logout() {
    this.user = null;
    this.isAuthenticated = false;
    localStorage.removeItem("auth_token");
  }

  async fetchUser(userId: number) {
    this.isLoading = true;
    this.error = null;

    try {
      const user = await fetchUserAPI(userId);
      if (this.user && user.id === this.user.id) {
        this.user = user;
      }
      return user;
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
      console.error("Fetch user error:", err);
      throw err;
    } finally {
      this.isLoading = false;
    }
  }

  setUser(user: User | null) {
    this.user = user;
    this.isAuthenticated = !!user;
  }

  async updateUserRoles(userId: number, roleIds: number[]) {
    this.isLoading = true;
    this.error = null;

    try {
      const updatedUser = await updateUserRoles(userId, roleIds);

      if (this.user && updatedUser.id === this.user.id) {
        this.user = updatedUser;
      }

      return updatedUser;
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
      console.error("Update user roles error:", err);
      throw err;
    } finally {
      this.isLoading = false;
    }
  }
}

export const userStore = new UserStore();
