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
        primary: { value: "#f5f5f5" },
        accent: { value: "#2b7fff" },
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
