import routes from "../api"

import glob from "glob"
import path from "path"

export default async ({ app }) => {
  app.use("/", routes())
  return app
}
