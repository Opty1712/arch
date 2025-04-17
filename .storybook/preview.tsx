import type { Preview } from "@storybook/react";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { appConfig } from "../src/config/appConfig";
import { i18n } from "../src/i18n";

appConfig.IS_STORYBOOK = true;

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    i18n,
    locale: "ru",
  },
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    ),
  ],
};

export default preview;
