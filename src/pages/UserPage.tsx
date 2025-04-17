import { ErrorMessage } from "@/components/ErrorMessage";
import { APP_ROUTES } from "@/router/routes";
import { $roleStore } from "@/stores/roleStore";
import { $usersStore } from "@/stores/usersStore";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useRoute } from "wouter";

const UserPageComponent: React.FC = () => {
  const { t } = useTranslation();
  const [, params] = useRoute("/user/:id");
  const userId = params?.id ? parseInt(params.id, 10) : 0;
  const [, navigate] = useLocation();

  const { currentUser, isLoading, error } = $usersStore;

  useEffect(() => {
    if (userId) {
      $roleStore.fetchRoles();
      $usersStore.fetchUserById(userId);
    }
  }, [userId]);

  const handleRoleToggle = async (roleId: number, checked: boolean) => {
    if (!currentUser) return;

    const newRoleIds = checked
      ? [...currentUser.roleIds, roleId]
      : currentUser.roleIds.filter((id) => id !== roleId);

    await $usersStore.updateUserRoles(userId, newRoleIds);
  };

  const handleBackClick = () => {
    navigate(APP_ROUTES["/roles"]);
  };

  const { roles } = $roleStore;
  const combinedIsLoading = isLoading || $roleStore.isLoading;
  const combinedError = error || $roleStore.error;

  if (combinedIsLoading) {
    return <div>Loading...</div>;
  }

  if (combinedError) {
    return <ErrorMessage error={combinedError} />;
  }

  if (!currentUser) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <button onClick={handleBackClick}>← {t("user.back_to_users")}</button>

      <h2>{currentUser.name}</h2>
      <div>{currentUser.email}</div>

      <h3>{t("user.roles")}</h3>
      <div>
        {roles.map((role) => (
          <label key={role.id} style={{ display: "block", margin: "5px 0" }}>
            <input
              type="checkbox"
              checked={currentUser.roleIds.includes(role.id)}
              onChange={(e) => handleRoleToggle(role.id, e.target.checked)}
            />
            {" " + role.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export const UserPage = observer(UserPageComponent);
