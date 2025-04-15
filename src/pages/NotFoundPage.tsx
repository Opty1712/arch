import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { AppRoutes } from "../router/Router";

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  const homeRoute = AppRoutes["/roles"];

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <div className="text-8xl font-bold text-gray-200">404</div>
      <h2 className="text-2xl font-medium mb-4">{t("not_found.title")}</h2>
      <p className="text-text-secondary mb-6">{t("not_found.description")}</p>
      <Link
        to={homeRoute}
        className="inline-block bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-200 font-medium text-sm"
      >
        {t("not_found.go_home")}
      </Link>
    </div>
  );
};
