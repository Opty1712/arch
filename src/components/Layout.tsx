import { observer } from "mobx-react-lite";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { userStore } from "../stores/userStore";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutComponent: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
  };

  const handleLogout = () => {
    userStore.logout();
    setLocation("/");
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

          {userStore.isAuthenticated && (
            <button onClick={handleLogout}>{t("layout.logout")}</button>
          )}
        </div>
      </header>

      <main>{children}</main>

      <footer>User Management App &copy; {new Date().getFullYear()}</footer>
    </div>
  );
};

export const Layout = observer(LayoutComponent);
