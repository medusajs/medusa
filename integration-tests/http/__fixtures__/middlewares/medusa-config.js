const baseConfig = require("../../medusa-config")

module.exports = {
  ...baseConfig,
  projectConfig: {
    ...baseConfig.projectConfig,
    databaseUrl: process.env.DB_TEMP_NAME || "postgres://localhost/medusa-test",
    databaseType: "postgres",
  },
}
