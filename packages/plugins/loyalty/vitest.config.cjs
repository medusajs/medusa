const path = require("node:path")

module.exports = {
  resolve: {
    alias: {
      "@medusajs/framework/zod": path.resolve(
        __dirname,
        "../../../node_modules/zod/index.js"
      ),
      "@medusajs/icons": path.resolve(
        __dirname,
        "../../design-system/icons/src/index.ts"
      ),
      "@medusajs/ui": path.resolve(
        __dirname,
        "../../design-system/ui/src/index.ts"
      ),
    },
  },
}
