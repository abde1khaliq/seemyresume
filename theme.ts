import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
    },
  },
  theme: {
    tokens: {
      colors: {
        // Will be set right after we pick a theme for the project
        // Example:
        // primary: { value: "#f5f5f5" },
        // accent: { value: "#5271ff" },
        // You can read more on; https://chakra-ui.com/docs/theming/overview
      },
      fonts: {
        inter: { value: "inter" },
      },
    },
  },
});

const system = createSystem(config, defaultConfig);
export default system;
