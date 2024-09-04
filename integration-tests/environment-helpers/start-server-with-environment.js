const setupServer = require("./setup-server")
const { initDb } = require("./use-db")

const startServerWithEnvironment = async ({
  cwd,
  redisUrl,
  uploadDir,
  verbose,
  env,
}) => {
  if (env) {
    Object.entries(env).forEach(([key, value]) => {
      process.env[key] = value
    })
  }

  const dbConnection = await initDb({
    cwd,
  })

  if (env) {
    Object.entries(env).forEach(([key]) => {
      delete process.env[key]
    })
  }

  const medusaProcess = await setupServer({
    cwd,
    verbose,
    redisUrl,
    uploadDir,
    env,
  })

  return [medusaProcess, dbConnection]
}

export default startServerWithEnvironment
