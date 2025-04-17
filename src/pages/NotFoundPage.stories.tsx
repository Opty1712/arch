import { User } from "@/network/user/types";
import type { Meta, StoryObj } from "@storybook/react";
import { $userStore } from "../stores/userStore";
import { NotFoundPage } from "./NotFoundPage";

const mockUser: User = {
  id: 1,
  name: "Демо Пользователь",
  email: "demo@example.com",
  roleIds: [1, 2],
};

const meta = {
  title: "Pages/NotFound",
  component: NotFoundPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      $userStore.setUser(mockUser);
      $userStore.isAuthenticated = true;
      $userStore.isLoading = false;
      $userStore.error = null;

      return <Story />;
    },
  ],
} satisfies Meta<typeof NotFoundPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
