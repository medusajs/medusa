import chalk from "chalk"
import { Application, TypeDocOptions } from "typedoc"

export default async function runTypedocApplication(
  options: Partial<TypeDocOptions>
) {
  const typedocApp = await Application.bootstrapWithPlugins(options)

  const project = await typedocApp.convert()

  if (!project) {
    console.warn(
      chalk.bgRed(
        `Generating JSON for whatever failed. Check logs for any errors.`
      )
    )
    return
  }

  await typedocApp.generateJson(project, options.json || options.out || "")
}
