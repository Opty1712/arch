import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "wouter";
import { ErrorMessage } from "../components/ErrorMessage";
import { User as UserType } from "../network/user/types";
import { AppRoutes } from "../router/Router";
import { roleStore } from "../stores/roleStore";
import { userStore } from "../stores/userStore";

const User: React.FC = () => {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();

  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = params.id ? parseInt(params.id, 10) : -1;

  useEffect(() => {
    const fetchUserData = async () => {
      if (isNaN(userId) || userId < 0) {
        setError("Invalid user ID");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        if (roleStore.roles.length === 0) {
          await roleStore.fetchRoles();
        }

        const userData = await userStore.fetchUser(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    return () => {};
  }, [userId]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    userStore
      .fetchUser(userId)
      .then((userData) => setUser(userData))
      .catch((err) =>
        setError(err instanceof Error ? err.message : String(err))
      )
      .finally(() => setIsLoading(false));
  };

  const roleNames = user?.roleIds
    ? roleStore.getRoleNamesByIds(user.roleIds)
    : [];

  return (
    <div>
      <h2>{t("user.profile")}</h2>
      <Link to={AppRoutes["/roles"]}>
        <span>arrow_back</span>
        {t("user.back_to_list")}
      </Link>

      {isLoading && (
        <div>
          <span>refresh</span>
          <span>{t("user.loading")}</span>
        </div>
      )}

      {!isLoading && error && (
        <div>
          <ErrorMessage error={error} translationKey="error.loading_user" />
          <button onClick={handleRetry}>{t("user.retry")}</button>
        </div>
      )}

      {!isLoading && !error && user && (
        <>
          <span>person</span>

          <div>
            <h3>{user.name}</h3>

            <div>
              <div>
                <p>{t("user.email")}</p>
                <p>{user.email}</p>
              </div>

              <div>
                <p>{t("user.id")}</p>
                <p>{user.id}</p>
              </div>

              <div>
                <p>{t("user.roles")}</p>
                <div>
                  {roleNames.length > 0 ? (
                    roleNames.map((roleName, index) => (
                      <span key={index}>{roleName}</span>
                    ))
                  ) : (
                    <span>{t("user.no_roles")}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const UserPage = observer(User);
