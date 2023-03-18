const original = require("./original-next.config")

module.exports = {
  ...original,
  output: "standalone",
  typescript: {
    ...(original.typescript ?? {}),
    ignoreBuildErrors: true,
  },
}
