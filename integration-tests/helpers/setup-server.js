const path = require("path")
const { spawn } = require("child_process")
const { setPort } = require("./use-api")

module.exports = ({ cwd, redisUrl, uploadDir, verbose }) => {
  const serverPath = path.join(__dirname, "test-server.js")

  return new Promise((resolve, reject) => {
    const medusaProcess = spawn("node", [path.resolve(serverPath)], {
      cwd,
      env: {
        ...process.env,
        NODE_ENV: "development",
        JWT_SECRET: "test",
        COOKIE_SECRET: "test",
        REDIS_URL: redisUrl, // If provided, will use a real instance, otherwise a fake instance
        UPLOAD_DIR: uploadDir // If provided, will be used for the fake local file service
      },
      stdio: verbose
        ? ["inherit", "inherit", "inherit", "ipc"]
        : ["ignore", "ignore", "ignore", "ipc"],
    })

    medusaProcess.on("uncaughtException", (err) => {
      medusaProcess.kill()
    })

    medusaProcess.on("message", (port) => {
      setPort(port)
      resolve(medusaProcess)
    })
  })
}
