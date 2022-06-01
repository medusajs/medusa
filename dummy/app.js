const path = require("path")
const express = require("express")
const getPort = require("get-port")
const importFrom = require("import-from")
const https = require("https");
const fs = require("fs");

const bootstrapApp = async () => {
  const app = express()

  const loaders = importFrom(
    process.cwd(),
    "@medusajs/medusa/dist/loaders"
  ).default

  const { container, dbConnection } = await loaders({
    directory: path.resolve(process.cwd()),
    expressApp: app,
    isTest: false,
  })

  const PORT = await getPort()

  return {
    container,
    db: dbConnection,
    app,
    port: PORT,
  }
}

bootstrapApp().then(({ app, port }) => {
  https
  .createServer({
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    }, app)
  .listen(9000, () =>{
    console.log('server is runing at port 3000')
  });
})
