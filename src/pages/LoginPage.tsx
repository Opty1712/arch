import { ErrorMessage } from "@/components/ErrorMessage";
import { appConfig } from "@/config/appConfig";
import { APP_ROUTES } from "@/router/routes";
import { $userStore } from "@/stores/userStore";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [, navigate] = useLocation();

  const { isLoading, error } = $userStore;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      try {
        await $userStore.login(username);
        navigate(APP_ROUTES["/roles"]);
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  if ($userStore.isAuthenticated && $userStore.user) {
    return (
      <div>
        <h2>{t("login.welcome", { name: $userStore.user.name })}</h2>
        <p>{t("login.already_logged_in")}</p>
        <Link href={APP_ROUTES["/roles"]}>
          <button>{t("login.go_to_roles")}</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2>{t("login.title")}</h2>

      {error && <ErrorMessage error={error} />}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">{t("login.username")}</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? `⟳ ${t("login.submit")}` : t("login.submit")}
        </button>
      </form>

      {appConfig.IS_MOCK_MODE && (
        <div>
          <p>
            {t("login.demo_info") ||
              "Это демо-режим. Введите любое имя пользователя для входа."}
          </p>
        </div>
      )}
    </div>
  );
};

export const LoginPage = observer(Login);
