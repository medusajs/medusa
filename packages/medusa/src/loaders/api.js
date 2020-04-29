import routes from "../api"

import glob from "glob"
import path from "path"

export default async ({ app }) => {
  const corePath = path.join(__dirname, "../api")
  app.use("/", routes())
  return app
}
