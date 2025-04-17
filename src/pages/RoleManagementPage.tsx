import { ErrorMessage } from "@/components/ErrorMessage";
import { User } from "@/network/user/types";
import { getUsers, updateUserRoles } from "@/network/user/userApi";
import { AppRoutes } from "@/router/Router";
import { $roleStore } from "@/stores/roleStore";
import { $userStore } from "@/stores/userStore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";

const RoleManagement: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    // Если пользователь не аутентифицирован, перенаправляем на страницу входа
    if (!$userStore.isAuthenticated) {
      navigate(AppRoutes["/login"]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [, usersData] = await Promise.all([
          $roleStore.fetchRoles(),
          getUsers(),
        ]);
        setUsers(usersData);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [$userStore.isAuthenticated]);

  const handleRoleToggle = async (
    userId: number,
    roleId: number,
    checked: boolean
  ) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const newRoleIds = checked
      ? [...user.roleIds, roleId]
      : user.roleIds.filter((id) => id !== roleId);

    try {
      const updatedUser = await updateUserRoles(userId, newRoleIds);
      setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    } catch (err) {
      console.error("Failed to update user roles:", err);
      alert("Failed to update user roles");
    }
  };

  const { roles } = $roleStore;
  const combinedIsLoading = isLoading || $roleStore.isLoading;
  const combinedError = error || $roleStore.error;

  return (
    <div>
      <h2>{t("roles.title")}</h2>

      {combinedIsLoading && <div>{t("roles.loading")}</div>}

      {!combinedIsLoading && combinedError && (
        <ErrorMessage
          error={combinedError}
          translationKey="error.loading_data"
        />
      )}

      {!combinedIsLoading &&
        !combinedError &&
        users.length > 0 &&
        roles.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>{t("roles.user_column")}</th>
                {roles.map((role) => (
                  <th key={role.id}>{role.name}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <Link
                      to={AppRoutes["/user/:id"].replace(
                        ":id",
                        user.id.toString()
                      )}
                    >
                      {user.name}
                    </Link>
                    <div>({user.email})</div>
                  </td>

                  {roles.map((role) => (
                    <td key={role.id}>
                      <input
                        type="checkbox"
                        checked={user.roleIds.includes(role.id)}
                        onChange={(e) =>
                          handleRoleToggle(user.id, role.id, e.target.checked)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
};

export const RoleManagementPage = observer(RoleManagement);
