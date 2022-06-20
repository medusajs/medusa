const redisLoader = require("@medusajs/medusa/dist/loaders/redis").default
const path = require("path")

const { bootstrapApp } = require("./bootstrap-app")

const setup = async () => {
  const cwd = path.resolve(path.join(__dirname, "..", "./api"))

  const configPath = path.resolve(path.join(cwd, `medusa-config.js`))
  const config = require(configPath)

  const { app, container, port } = await bootstrapApp()

  if (process.env.REDIS_URL) {
    // after we know where the redis container is running, try connecting once more
    config.projectConfig.redis_url = process.env.REDIS_URL
    await redisLoader({
      container,
      configModule: config,
      logger: {},
    })
  }

  app.listen(port, (err) => {
    process.send(port)
  })
}

setup()
