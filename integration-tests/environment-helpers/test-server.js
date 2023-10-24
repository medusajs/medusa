const { bootstrapApp } = require("./bootstrap-app")
const { setContainer } = require("./use-container")

const setup = async () => {
  const { app, port, container } = await bootstrapApp()

  setContainer(container)

  app.listen(port, (err) => {
    process.send(port)
  })
}

setup()
