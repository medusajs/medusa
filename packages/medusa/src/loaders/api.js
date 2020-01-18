import routes from "../api"

export default async ({ app }) => {
  app.use("/", routes())
  return app
}
