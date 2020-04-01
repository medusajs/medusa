import routes from "../api"

import glob from "glob"
import path from "path"

export default async ({ app }) => {
  const corePath = path.join(__dirname, "../api")
  const appPath = path.resolve("src/api")

  if (corePath !== appPath) {
    const appRoutes = require(appPath).default
    if (appRoutes) {
      app.use("/", appRoutes())
    }
  }

  app.use("/", routes())

  return app
}
