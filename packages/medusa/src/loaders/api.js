import { getConfigFile } from "medusa-core-utils"

import routes from "../api"

export default async ({ app, rootDirectory, container }) => {
  const { configModule } = getConfigFile(rootDirectory, `medusa-config`)
  const config = (configModule && configModule.projectConfig) || {}
  app.use("/", routes(container, config))
  return app
}
