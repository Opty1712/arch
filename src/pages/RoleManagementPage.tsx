import { ErrorMessage } from "@/components/ErrorMessage";
import { APP_ROUTES } from "@/router/routes";
import { $roleStore } from "@/stores/roleStore";
import { $rolesPageStore } from "@/stores/rolesPageStore";
import { $userStore } from "@/stores/userStore";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";

const RoleManagement: React.FC = () => {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  const { users, isLoading, error } = $rolesPageStore;

  useEffect(() => {
    if (!$userStore.isAuthenticated) {
      navigate(APP_ROUTES["/login"]);
      return;
    }

    $roleStore.fetchRoles();
    $rolesPageStore.fetchUsers();
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

    await $rolesPageStore.updateUserRoles(userId, newRoleIds);
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

      {!combinedIsLoading && !combinedError && users.length > 0 && (
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
                    to={APP_ROUTES["/user/:id"].replace(
                      ":id",
                      user.id.toString()
                    )}
                  >
                    {user.name}
                  </Link>
                  <div>({user.email})</div>
                </td>

                {roles.length > 0 ? (
                  roles.map((role) => (
                    <td key={role.id}>
                      <input
                        type="checkbox"
                        checked={user.roleIds.includes(role.id)}
                        onChange={(e) =>
                          handleRoleToggle(user.id, role.id, e.target.checked)
                        }
                      />
                    </td>
                  ))
                ) : (
                  <td>{t("roles.no_roles_defined")}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!combinedIsLoading && !combinedError && users.length === 0 && (
        <div>{t("roles.no_users")}</div>
      )}
    </div>
  );
};

export const RoleManagementPage = observer(RoleManagement);
