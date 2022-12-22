const path = require("path")

const Redis = require("ioredis")
const { GenericContainer } = require("testcontainers")

require("dotenv").config({ path: path.join(__dirname, "../.env") })

const workerId = parseInt(process.env.JEST_WORKER_ID || "1")

const DB_USERNAME = process.env.DB_USERNAME || "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD || ""

const DbTestUtil = {
  db_: null,

  setDb: function (connection) {
    this.db_ = connection
  },

  clear: async function () {
    /* noop */
  },

  teardown: async function () {
    /* noop */
  },

  shutdown: async function () {
    /* noop */
    // TODO: stop container
  },
}

const instance = DbTestUtil

module.exports = {
  initRedis: async function ({ cwd }) {
    // const configPath = path.resolve(path.join(cwd, `medusa-config.js`))
    // const { projectConfig } = require(configPath)

    const container = await new GenericContainer("redis")
      .withExposedPorts(6379)
      .start()

    const redisClient = new Redis({
      host: container.getHost(),
      port: container.getMappedPort(6379),
      db: workerId,
    })

    instance.setDb(redisClient)

    return redisClient
  },
  useRedis: function () {
    return instance
  },
}
