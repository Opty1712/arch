import type { Meta, StoryObj } from "@storybook/react";
import { $roleStore } from "../stores/roleStore";
import { $userStore } from "../stores/userStore";
import { RoleManagementPage } from "./RoleManagementPage";

const setupMocks = () => {
  if (!$userStore.isAuthenticated) {
    $userStore.setUser({
      id: 1,
      name: "Демо Пользователь",
      email: "demo@example.com",
      roleIds: [1, 2],
    });
  }
};

const meta = {
  title: "Pages/RoleManagement",
  component: RoleManagementPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      setupMocks();
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
      setupMocks();
      $userStore.isLoading = true;
      return <Story />;
    },
  ],
};

export const WithError: Story = {
  decorators: [
    (Story) => {
      setupMocks();
      $roleStore.error = "Не удалось загрузить данные о ролях";
      return <Story />;
    },
  ],
};
