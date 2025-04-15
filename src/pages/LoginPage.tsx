import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ErrorMessage } from "../components/ErrorMessage";
import { userStore } from "../stores/userStore";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      await userStore.login(username);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-medium mb-6 text-center">
        {t("login.title")}
      </h2>

      {userStore.error && <ErrorMessage error={userStore.error} />}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-text-secondary text-sm font-medium mb-2"
          >
            {t("login.username")}
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={userStore.isLoading}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          disabled={userStore.isLoading}
        >
          {userStore.isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("login.submit")}
            </span>
          ) : (
            t("login.submit")
          )}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-text-secondary">
        <p>{t("login.demo_info")}</p>
      </div>
    </div>
  );
};

export const LoginPage = observer(Login);
