module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-docs`
  extends: ["docs"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};