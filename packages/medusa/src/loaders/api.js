import routes from "../api"

export default async ({ app, rootDirectory, container }) => {
  const { configModule } = getConfigFile(rootDirectory, `medusa-config`)
  const config = (configModule && configModule.projectConfig) || {}

  app.use("/", routes(container))
  return app
}
