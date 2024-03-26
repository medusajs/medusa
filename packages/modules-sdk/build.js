const fs = require("fs")
const path = require("path")

const protoSource = path.join(__dirname, "src/utils/servers/medusa-app.proto")
const protoDest = path.join(__dirname, "dist", "utils/servers/medusa-app.proto")

fs.copyFileSync(protoSource, protoDest)
