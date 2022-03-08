const { bootstrapApp } = require("./bootstrap-app")

const setup = async () => {
  const { app, port } = await bootstrapApp()

  app.listen(port, (err) => {
    process.send(port)
  })
}

setup()
