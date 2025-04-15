import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ErrorMessage } from "../components/ErrorMessage";
import { User } from "../network/user/types";
import { fetchUsers } from "../network/user/userApi";
import { roleStore } from "../stores/roleStore";
import { userStore } from "../stores/userStore";

const RoleManagement: React.FC = () => {
  const { t } = useTranslation();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load users and roles data
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Load roles first
        if (roleStore.roles.length === 0) {
          await roleStore.fetchRoles();
        }

        // Then load users
        const usersData = await fetchUsers();

        if (isMounted) {
          setUsers(usersData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);

    Promise.all([
      roleStore.roles.length === 0
        ? roleStore.fetchRoles()
        : Promise.resolve(roleStore.roles),
      fetchUsers(),
    ])
      .then(([_, usersData]) => {
        setUsers(usersData);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRoleToggle = async (
    userId: number,
    roleId: number,
    checked: boolean
  ) => {
    // Find the user
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    // Update role IDs
    const newRoleIds = checked
      ? [...user.roleIds, roleId] // Add role
      : user.roleIds.filter((id) => id !== roleId); // Remove role

    try {
      // Update user roles
      const updatedUser = await userStore.updateUserRoles(userId, newRoleIds);

      // Update local users list
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
    } catch (err) {
      console.error("Failed to update user roles:", err);
      // Show error message - in a real app, you'd use a toast or similar
      alert("Failed to update user roles");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-medium mb-6">{t("roles.title")}</h2>

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
          <span className="material-icons animate-spin text-primary">
            refresh
          </span>
          <span className="ml-2">{t("roles.loading")}</span>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <ErrorMessage error={error} translationKey="error.loading_data" />
          <button
            className="mt-4 text-primary hover:text-opacity-80 transition duration-200 font-medium text-sm"
            onClick={handleRetry}
          >
            {t("roles.retry")}
          </button>
        </div>
      )}

      {/* Role management table */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    {t("roles.user_column")}
                  </th>

                  {roleStore.roles.map((role) => (
                    <th
                      key={role.id}
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                    >
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap border-b">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          <Link
                            to={`/user/${user.id}`}
                            className="text-primary hover:text-opacity-80 transition duration-200"
                          >
                            {user.name}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500 ml-1">
                          ({user.email})
                        </div>
                      </div>
                    </td>

                    {roleStore.roles.map((role) => (
                      <td
                        key={role.id}
                        className="px-6 py-4 whitespace-nowrap text-center border-b"
                      >
                        <input
                          type="checkbox"
                          className="h-5 w-5 text-primary rounded focus:ring-primary"
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
          </div>
        </div>
      )}
    </div>
  );
};

export const RoleManagementPage = observer(RoleManagement);
