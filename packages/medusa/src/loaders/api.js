import routes from "../api"

import glob from "glob"
import path from "path"

export default async ({ app, container }) => {
  app.use("/", routes(container))
  return app
}
