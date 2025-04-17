import { Role } from "@/network/role/types";
import { User } from "@/network/user/types";
import type { Meta, StoryObj } from "@storybook/react";
import { $roleStore } from "../stores/roleStore";
import { $usersStore } from "../stores/usersStore";
import { UserPage } from "./UserPage";

const mockRoles: Role[] = [
  { id: 1, name: "администратор", description: "Полный доступ" },
  { id: 2, name: "модератор", description: "Управление контентом" },
  { id: 3, name: "пользователь", description: "Базовый доступ" },
];

const mockUser: User = {
  id: 1,
  name: "Демо Пользователь",
  email: "demo@example.com",
  roleIds: [1, 2],
};

const meta = {
  title: "Pages/User",
  component: UserPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      $usersStore.setCurrentUser(mockUser);
      $usersStore.setLoading(false);
      $usersStore.setError(null);

      $roleStore.setRoles(mockRoles);
      $roleStore.setInitialized(true);
      $roleStore.isLoading = false;
      $roleStore.error = null;

      return <Story />;
    },
  ],
} satisfies Meta<typeof UserPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  decorators: [
    (Story) => {
      $usersStore.setLoading(true);
      return <Story />;
    },
  ],
};

export const WithError: Story = {
  decorators: [
    (Story) => {
      $usersStore.setError(
        new Error("Не удалось загрузить данные пользователя")
      );
      return <Story />;
    },
  ],
};

export const NoRoles: Story = {
  decorators: [
    (Story) => {
      const userWithNoRoles = {
        ...mockUser,
        roleIds: [],
      };
      $usersStore.setCurrentUser(userWithNoRoles);
      return <Story />;
    },
  ],
};
