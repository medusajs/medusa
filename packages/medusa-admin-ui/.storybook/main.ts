import { type StorybookViteConfig } from "@storybook/builder-vite"
import { mergeConfig, type UserConfig } from "vite"
import viteConfig from "../vite.config"

const config: StorybookViteConfig = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    storyStoreV7: true,
  },
  async viteFinal(config) {
    const userConfig = viteConfig as UserConfig
    return mergeConfig(config, {
      resolve: userConfig.resolve,
      define: userConfig.define,
      optimizeDeps: {
        include: ["storybook-dark-mode"],
      },
    })
  },
}

export default config
