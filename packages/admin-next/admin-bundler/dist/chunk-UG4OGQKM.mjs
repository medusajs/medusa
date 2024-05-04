// src/api/build.ts
import { resolve } from "path";
import { build as command } from "vite";

// src/api/create-vite-config.ts
import inject from "@medusajs/vite-plugin-extension";
import react from "@vitejs/plugin-react";
import deepmerge from "deepmerge";
import { createRequire } from "module";
import path from "path";
import { createLogger, mergeConfig } from "vite";
var require2 = createRequire(import.meta.url);
async function createViteConfig(inline) {
  const root = process.cwd();
  const logger = createCustomLogger();
  let dashboardRoot = null;
  try {
    dashboardRoot = path.dirname(require2.resolve("@medusajs/dashboard"));
  } catch (err) {
    dashboardRoot = null;
  }
  if (!dashboardRoot) {
    logger.error(
      "Unable to find @medusajs/dashboard. Please install it in your project, or specify the root directory."
    );
    return null;
  }
  const { plugins, userConfig } = await loadConfig(root, logger) ?? {};
  let viteConfig = mergeConfig(inline, {
    plugins: [
      react(),
      inject({
        sources: plugins
      })
    ],
    configFile: false,
    root: dashboardRoot,
    css: {
      postcss: {
        plugins: [
          require2("tailwindcss")({
            config: createTwConfig(process.cwd(), dashboardRoot)
          }),
          require2("autoprefixer")
        ]
      }
    }
  });
  if (userConfig) {
    viteConfig = await userConfig(viteConfig);
  }
  return viteConfig;
}
function mergeTailwindConfigs(config1, config2) {
  const content1 = config1.content;
  const content2 = config2.content;
  let mergedContent;
  if (Array.isArray(content1) && Array.isArray(content2)) {
    mergedContent = [...content1, ...content2];
  } else if (!Array.isArray(content1) && !Array.isArray(content2)) {
    mergedContent = {
      files: [...content1.files, ...content2.files],
      relative: content1.relative || content2.relative,
      extract: { ...content1.extract, ...content2.extract },
      transform: { ...content1.transform, ...content2.transform }
    };
  } else {
    throw new Error("Cannot merge content fields of different types");
  }
  const mergedConfig = deepmerge(config1, config2);
  mergedConfig.content = mergedContent;
  console.log(config1.presets, config2.presets);
  mergedConfig.presets = config1.presets || [];
  return mergedConfig;
}
function createTwConfig(root, dashboardRoot) {
  const uiRoot = path.join(
    path.dirname(require2.resolve("@medusajs/ui")),
    "**/*.{js,jsx,ts,tsx}"
  );
  const baseConfig = {
    presets: [require2("@medusajs/ui-preset")],
    content: [
      `${root}/src/admin/**/*.{js,jsx,ts,tsx}`,
      `${dashboardRoot}/src/**/*.{js,jsx,ts,tsx}`,
      uiRoot
    ],
    darkMode: "class",
    theme: {
      extend: {}
    },
    plugins: []
  };
  let userConfig = null;
  const extensions = ["js", "cjs", "mjs", "ts", "cts", "mts"];
  for (const ext of extensions) {
    try {
      userConfig = require2(path.join(root, `tailwind.config.${ext}`));
      break;
    } catch (err) {
      console.log("Failed to load tailwind config with extension", ext, err);
      userConfig = null;
    }
  }
  if (!userConfig) {
    return baseConfig;
  }
  return mergeTailwindConfigs(baseConfig, userConfig);
}
function createCustomLogger() {
  const logger = createLogger("info", {
    prefix: "medusa-admin"
  });
  const loggerInfo = logger.info;
  logger.info = (msg, opts) => {
    if (msg.includes("hmr invalidate") && msg.includes(
      "Could not Fast Refresh. Learn more at https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#consistent-components-exports"
    )) {
      return;
    }
    loggerInfo(msg, opts);
  };
  return logger;
}
async function loadConfig(root, logger) {
  const configPath = path.resolve(root, "medusa-config.js");
  const config = await import(configPath).then((c) => c).catch((e) => {
    if (e.code === "ERR_MODULE_NOT_FOUND") {
      logger.warn(
        "Root 'medusa-config.js' file not found; extensions won't load. If running Admin UI as a standalone app, use the 'standalone' option.",
        {
          timestamp: true
        }
      );
    } else {
      logger.error(
        `An error occured while attempting to load '${configPath}':
${e}`,
        {
          timestamp: true
        }
      );
    }
    return null;
  });
  if (!config) {
    return;
  }
  if (!config.plugins?.length) {
    logger.info(
      "No plugins in 'medusa-config.js', no extensions will load. To enable Admin UI extensions, add them to the 'plugins' array in 'medusa-config.js'.",
      {
        timestamp: true
      }
    );
    return;
  }
  const uiPlugins = config.plugins.filter((p) => typeof p !== "string" && p.options?.enableUI).map((p) => {
    return typeof p === "string" ? p : p.resolve;
  });
  const extensionSources = uiPlugins.map((p) => {
    return path.resolve(require2.resolve(p), "dist", "admin");
  });
  const rootSource = path.resolve(process.cwd(), "src", "admin");
  extensionSources.push(rootSource);
  const adminPlugin = config.plugins.find(
    (p) => typeof p === "string" ? p === "@medusajs/admin" : p.resolve === "@medusajs/admin"
  );
  if (!adminPlugin) {
    logger.info(
      "No @medusajs/admin in 'medusa-config.js', no extensions will load. To enable Admin UI extensions, add it to the 'plugins' array in 'medusa-config.js'.",
      {
        timestamp: true
      }
    );
    return;
  }
  const adminPluginOptions = typeof adminPlugin !== "string" && !!adminPlugin.options ? adminPlugin.options : {};
  const viteConfig = adminPluginOptions.withFinal;
  return {
    plugins: extensionSources,
    userConfig: viteConfig
  };
}

// src/api/build.ts
async function build({ root }) {
  const config = await createViteConfig({
    build: {
      outDir: resolve(process.cwd(), "build")
    }
  });
  if (!config) {
    return;
  }
  await command(config);
}

// src/api/bundle.ts
import { readFileSync } from "fs";
import glob from "glob";
import { relative, resolve as resolve2 } from "path";
import { build as command2 } from "vite";
async function bundle({ watch, root }) {
  const resolvedRoot = root ? resolve2(process.cwd(), root) : resolve2(process.cwd(), "src", "admin");
  const files = glob.sync(`${resolvedRoot}/**/*.{ts,tsx,js,jsx}`);
  const input = {};
  for (const file of files) {
    const relativePath = relative(resolvedRoot, file);
    input[relativePath] = file;
  }
  const packageJson = JSON.parse(
    readFileSync(resolve2(process.cwd(), "package.json"), "utf-8")
  );
  const external = [
    ...Object.keys(packageJson.dependencies),
    "@medusajs/ui",
    "@medusajs/ui-preset",
    "react",
    "react-dom",
    "react-router-dom",
    "react-hook-form"
  ];
  await command2({
    build: {
      watch: watch ? {} : void 0,
      rollupOptions: {
        input,
        external
      }
    }
  });
}

// src/api/dev.ts
import { createServer } from "vite";
async function dev({ port = 5173, host }) {
  const config = await createViteConfig({
    server: {
      port,
      host
    }
  });
  if (!config) {
    return;
  }
  const server = await createServer(config);
  await server.listen();
  server.printUrls();
  server.bindCLIShortcuts({ print: true });
}

export {
  build,
  bundle,
  dev
};
