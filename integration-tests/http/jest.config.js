process.chdir(__dirname)

module.exports = {
  testEnvironment: `node`,
  rootDir: "./",
  transformIgnorePatterns: ["/dist", "/node_modules/"],
  transform: {
    "^.+\\.[jt]s$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", decorators: true },
          transform: { decoratorMetadata: true },
        },
      },
    ],
  },
  setupFiles: ["../setup-env.js"],
}
