const path = require("path")
const { spawn } = require("child_process")
const { setPort } = require("./use-api")
const workerId = parseInt(process.env.JEST_WORKER_ID || "1")

module.exports = ({ cwd, verbose }) => {
  const serverPath = path.join(__dirname, "test-server.js")

  return new Promise((resolve, reject) => {
    const medusaProcess = spawn("node", [path.resolve(serverPath)], {
      cwd,
      env: {
        ...process.env,
        NODE_ENV: "development",
        WORKER_ID: workerId,
        JWT_SECRET: "test",
        COOKIE_SECRET: "test",
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
