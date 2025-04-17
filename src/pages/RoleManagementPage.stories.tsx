import { Role } from "@/network/role/types";
import { User } from "@/network/user/types";
import type { Meta, StoryObj } from "@storybook/react";
import { $roleStore } from "../stores/roleStore";
import { $rolesPageStore } from "../stores/rolesPageStore";
import { $userStore } from "../stores/userStore";
import { RoleManagementPage } from "./RoleManagementPage";

const mockRoles: Role[] = [
  { id: 1, name: "администратор", description: "Полный доступ" },
  { id: 2, name: "модератор", description: "Управление контентом" },
  { id: 3, name: "пользователь", description: "Базовый доступ" },
];

const mockUsers: User[] = [
  {
    id: 1,
    name: "Иван Петров",
    email: "ivan@example.com",
    roleIds: [1, 3],
  },
  {
    id: 2,
    name: "Мария Сидорова",
    email: "maria@example.com",
    roleIds: [2],
  },
  {
    id: 3,
    name: "Алексей Николаев",
    email: "alexey@example.com",
    roleIds: [3],
  },
];

const meta = {
  title: "Pages/RoleManagement",
  component: RoleManagementPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      $rolesPageStore.setUsers(mockUsers);
      $rolesPageStore.setLoading(false);
      $rolesPageStore.setError(null);

      $userStore.setUser(mockUsers[0]);
      $userStore.isAuthenticated = true;
      $userStore.isLoading = false;
      $userStore.error = null;

      $roleStore.setRoles(mockRoles);
      $roleStore.setInitialized(true);
      $roleStore.isLoading = false;
      $roleStore.error = null;

      return <Story />;
    },
  ],
} satisfies Meta<typeof RoleManagementPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  decorators: [
    (Story) => {
      $rolesPageStore.setLoading(true);
      return <Story />;
    },
  ],
};

export const WithError: Story = {
  decorators: [
    (Story) => {
      $rolesPageStore.setError(
        new Error("Не удалось загрузить данные о ролях")
      );
      return <Story />;
    },
  ],
};
