const { bootstrapApp } = require("./bootstrap-app")
const { setContainer } = require("./use-container")
const { setPort, setExpressServer } = require("./use-api")

const setup = async () => {
  const { app, port, container } = await bootstrapApp()

  console.log("bootstrapped")
  console.log(container)
  setContainer(container)

  const expressServer = app.listen(port, (err) => {
    setPort(port)
    process.send(port)
  })

  setExpressServer(expressServer)
}

setup()
