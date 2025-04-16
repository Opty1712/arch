import { ErrorMessage } from "@/components/ErrorMessage";
import { User } from "@/network/user/types";
import { getUser, updateUserRoles } from "@/network/user/userApi";
import { AppRoutes } from "@/router/Router";
import { $rolesStore } from "@/stores/rolesStore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useRoute } from "wouter";

const UserPageComponent: React.FC = () => {
  const { t } = useTranslation();
  const [, params] = useRoute("/user/:id");
  const userId = params?.id ? parseInt(params.id, 10) : 0;
  const [, navigate] = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [, userData] = await Promise.all([
          $rolesStore.fetchRoles(),
          getUser(userId),
        ]);
        setUser(userData);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleRoleToggle = async (roleId: number, checked: boolean) => {
    if (!user) return;

    const newRoleIds = checked
      ? [...user.roleIds, roleId]
      : user.roleIds.filter((id) => id !== roleId);

    try {
      const updatedUser = await updateUserRoles(userId, newRoleIds);
      setUser(updatedUser);
    } catch (err) {
      console.error("Failed to update user roles:", err);
      alert("Failed to update user roles");
    }
  };

  const handleBackClick = () => {
    navigate(AppRoutes["/roles"]);
  };

  const { roles } = $rolesStore;
  const combinedIsLoading = isLoading || $rolesStore.isLoading;
  const combinedError = error || $rolesStore.error;

  if (combinedIsLoading) {
    return <div>Loading...</div>;
  }

  if (combinedError) {
    return <ErrorMessage error={combinedError} />;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <button onClick={handleBackClick}>← {t("user.back_to_users")}</button>

      <h2>{user.name}</h2>
      <div>{user.email}</div>

      <h3>{t("user.roles")}</h3>
      <div>
        {roles.map((role) => (
          <label key={role.id} style={{ display: "block", margin: "5px 0" }}>
            <input
              type="checkbox"
              checked={user.roleIds.includes(role.id)}
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
