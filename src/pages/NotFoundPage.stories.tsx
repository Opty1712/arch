import type { Meta, StoryObj } from "@storybook/react";
import { userStore } from "../stores/userStore";
import { NotFoundPage } from "./NotFoundPage";

const setupMocks = () => {
  userStore.setUser({
    id: 1,
    name: "Демо Пользователь",
    email: "demo@example.com",
    roleIds: [1, 2],
  });
};

const meta = {
  title: "Pages/NotFound",
  component: NotFoundPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      setupMocks();
      return <Story />;
    },
  ],
} satisfies Meta<typeof NotFoundPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DemoMode: Story = {
  decorators: [
    (Story) => {
      setupMocks();
      return <Story />;
    },
  ],
};
