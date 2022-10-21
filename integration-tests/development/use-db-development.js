const path = require("path")

const { createConnection } = require("typeorm")

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`

require("./dev-require")

async function createDB() {
  const connection = await createConnection({
    type: "postgres",
    url: `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}`,
  })

  await connection.query(`DROP DATABASE IF EXISTS "${DB_NAME}";`)
  await connection.query(`CREATE DATABASE "${DB_NAME}";`)
  await connection.close()
}

module.exports = {
  initDb: async function () {
    const cwd = path.resolve(path.join(__dirname, "../.."))

    const configPath = path.resolve(
      path.join(__dirname, "../api/medusa-config.js")
    )
    const { featureFlags } = require(configPath)

    const basePath = path.join(cwd, "packages/medusa/src")

    const featureFlagsLoader = require(path.join(
      basePath,
      `loaders`,
      `feature-flags`
    )).default

    const featureFlagsRouter = featureFlagsLoader({ featureFlags })

    const modelsLoader = require(path.join(
      basePath,
      `loaders`,
      `models`
    )).default

    const entities = modelsLoader({}, { register: false })

    // get migraitons with enabled featureflags
    const migrationDir = path.resolve(
      path.join(basePath, `migrations`, `*.{j,t}s`)
    )

    const { getEnabledMigrations } = require(path.join(
      basePath,
      `commands`,
      `utils`,
      `get-migrations`
    ))

    const enabledMigrations = await getEnabledMigrations(
      [migrationDir],
      (flag) => featureFlagsRouter.isFeatureEnabled(flag)
    )

    const enabledEntities = entities.filter(
      (e) => typeof e.isFeatureEnabled === "undefined" || e.isFeatureEnabled()
    )

    await createDB()
    const dbConnection = await createConnection({
      type: "postgres",
      url: DB_URL,
      entities: enabledEntities,
      migrations: enabledMigrations,
      //logging: true,
    })

    await dbConnection.runMigrations()

    return dbConnection
  },
}
