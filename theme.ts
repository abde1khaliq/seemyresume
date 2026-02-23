import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
      backgroundColor: "primary",
    },
  },
  theme: {
    tokens: {
      colors: {
        primary: { value: "#f2f2f2" },
        accent: { value: "#0059ff" },
        accentH: { value: "#196aff" },
      },
      fonts: {
        inter: { value: "inter" },
        quatt: { value: "quattrocento" },
      },
    },
  },
});

const system = createSystem(config, defaultConfig);
export default system;
