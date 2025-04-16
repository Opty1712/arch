import type { Preview } from "@storybook/react";
import React from "react";
import "../src/i18n/i18n";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

export default preview;
