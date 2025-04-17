import { User } from "@/network/user/types";
import type { Meta, StoryObj } from "@storybook/react";
import { $userStore } from "../stores/userStore";
import { LoginPage } from "./LoginPage";

// Мокированные данные
const mockUser: User = {
  id: 1,
  name: "Демо Пользователь",
  email: "demo@example.com",
  roleIds: [1, 2],
};

const meta = {
  title: "Pages/LoginPage",
  component: LoginPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      $userStore.isLoading = false;
      $userStore.error = null;
      $userStore.isAuthenticated = false;
      $userStore.user = null;

      return <Story />;
    },
  ],
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithError: Story = {
  decorators: [
    (Story) => {
      $userStore.error = new Error("Неверные учетные данные");
      return <Story />;
    },
  ],
};

export const Loading: Story = {
  decorators: [
    (Story) => {
      $userStore.isLoading = true;
      return <Story />;
    },
  ],
};

export const LoggedIn: Story = {
  decorators: [
    (Story) => {
      $userStore.isAuthenticated = true;
      $userStore.user = mockUser;
      return <Story />;
    },
  ],
};
