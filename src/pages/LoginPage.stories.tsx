import type { Meta, StoryObj } from "@storybook/react";
import { I18nextProvider } from "react-i18next";
import { i18n } from "../i18n/i18n";
import { LoginPage } from "./LoginPage";

import { userStore } from "../stores/userStore";

const resetStore = () => {
  userStore.isLoading = false;
  userStore.error = null;
  userStore.isAuthenticated = false;
  userStore.user = null;

  userStore.login = async (username: string) => {
    userStore.isLoading = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    userStore.isLoading = false;
    userStore.isAuthenticated = true;
    userStore.user = {
      id: 1,
      name: username,
      email: `${username.toLowerCase()}@example.com`,
      roleIds: [1],
    };
  };
};

const meta = {
  title: "Pages/LoginPage",
  component: LoginPage,
  decorators: [
    (Story) => {
      resetStore();
      return (
        <I18nextProvider i18n={i18n}>
          <Story />
        </I18nextProvider>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithError: Story = {
  args: {},
  play: async () => {
    userStore.error = "Invalid credentials";
  },
};

export const Loading: Story = {
  args: {},
  play: async () => {
    userStore.isLoading = true;
  },
};
