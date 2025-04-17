import { APP_ROUTES } from "@/router/routes";
import { $userStore } from "@/stores/userStore";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useRoute } from "wouter";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutComponent: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [, navigate] = useLocation();
  const [isLoginPage] = useRoute(APP_ROUTES["/login"]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token && !$userStore.isAuthenticated) {
        await $userStore.initFromStorage();
      }

      if (!$userStore.isAuthenticated && !isLoginPage) {
        navigate(APP_ROUTES["/login"]);
      }
    };

    checkAuth();
  }, [$userStore.isAuthenticated, isLoginPage]);

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    if (
      window.confirm(
        t("layout.confirm_logout") || "Вы уверены, что хотите выйти?"
      )
    ) {
      await $userStore.logout();
      navigate(APP_ROUTES["/login"]);
    }
  };

  return (
    <div>
      <header>
        <div>
          <h1>{t("layout.title")}</h1>

          <select onChange={handleLanguageChange} value={i18n.language}>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>

          {$userStore.isLoading && <span>⟳ {t("layout.loading")}</span>}

          {$userStore.isAuthenticated && (
            <button onClick={handleLogout}>{t("layout.logout")}</button>
          )}

          {$userStore.isAuthenticated && $userStore.user && (
            <span className="user-info">
              {t("layout.logged_in_as")} {$userStore.user.name}
            </span>
          )}
        </div>
      </header>

      <main>{children}</main>

      <footer>User Management App &copy; {new Date().getFullYear()}</footer>
    </div>
  );
};

export const Layout = observer(LayoutComponent);
