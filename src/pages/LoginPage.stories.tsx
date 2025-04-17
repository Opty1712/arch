import type { Meta, StoryObj } from "@storybook/react";
import { ComponentProps, FC } from "react";
import mockedUserData from "../network/auth/mocks/auth.mock.json";
import { $userStore } from "../stores/userStore";
import { LoginPage } from "./LoginPage";

type CombinedProps = Partial<typeof $userStore> &
  ComponentProps<typeof LoginPage> & { userName?: string };

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
} satisfies Meta<FC<CombinedProps>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

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
  args: {
    /** Пример того, как можно в сторю инъектить контролы и связывать их с mobX */
    userName: "David",
  },
  render: (args) => {
    $userStore.isAuthenticated = true;
    $userStore.user = {
      ...mockedUserData.user,
      name: args.userName || mockedUserData.user.name,
    };

    return <LoginPage />;
  },
};
