import type { Meta, StoryObj } from "@storybook/react";
import { roleStore } from "../stores/roleStore";
import { userStore } from "../stores/userStore";
import { UserPage } from "./UserPage";

const setupMocks = () => {
  if (!userStore.isAuthenticated) {
    userStore.setUser({
      id: 1,
      name: "Демо Пользователь",
      email: "demo@example.com",
      roleIds: [1, 2],
    });
  }

  if (roleStore.roles.length === 0) {
    roleStore.fetchRoles();
  }
};

const meta = {
  title: "Pages/User",
  component: UserPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      setupMocks();
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
      setupMocks();
      userStore.isLoading = true;
      return <Story />;
    },
  ],
};

export const WithError: Story = {
  decorators: [
    (Story) => {
      setupMocks();
      userStore.error = "Не удалось загрузить данные пользователя";
      return <Story />;
    },
  ],
};

export const NoRoles: Story = {
  decorators: [
    (Story) => {
      setupMocks();
      userStore.setUser({
        id: 2,
        name: "Пользователь без ролей",
        email: "noroles@example.com",
        roleIds: [],
      });
      return <Story />;
    },
  ],
};
