const path = require("path")
const { spawn } = require("child_process")
const { setPort } = require("./use-api")

module.exports = ({ cwd, redisUrl, uploadDir, verbose, env }) => {
  const serverPath = path.join(__dirname, "test-server.js")

  // in order to prevent conflicts in redis, use a different db for each worker
  // same fix as for databases (works with up to 15)
  // redis dbs are 0-indexed and jest worker ids are indexed from 1
  const workerId = parseInt(process.env.JEST_WORKER_ID || "1")
  const redisUrlWithDatabase = `${redisUrl}/${workerId - 1}`

  verbose = verbose ?? false

  return new Promise((resolve, reject) => {
    const medusaProcess = spawn("node", [path.resolve(serverPath)], {
      cwd,
      env: {
        ...process.env,
        NODE_ENV: "development",
        JWT_SECRET: "test",
        COOKIE_SECRET: "test",
        REDIS_URL: redisUrl ? redisUrlWithDatabase : undefined, // If provided, will use a real instance, otherwise a fake instance
        UPLOAD_DIR: uploadDir, // If provided, will be used for the fake local file service
        ...env,
      },
      stdio: verbose
        ? ["inherit", "inherit", "inherit", "ipc"]
        : ["ignore", "ignore", "ignore", "ipc"],
    })

    medusaProcess.on("error", (err) => {
      console.log(err)
      process.exit()
    })

    medusaProcess.on("uncaughtException", (err) => {
      console.log(err)
      medusaProcess.kill()
    })

    medusaProcess.on("message", (port) => {
      setPort(port)
      resolve(medusaProcess)
    })
  })
}
