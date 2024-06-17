import chalk from "chalk"
import randomColor from "randomcolor"
import { Application, TypeDocOptions } from "typedoc"
import formatColoredLog from "./format-colored-logs.js"

type Options = {
  options?: Partial<TypeDocOptions>
  referenceName: string
  outputType: "json" | "doc"
  startLog?: boolean
}

export default async function generateReference({
  options,
  referenceName,
  outputType,
  startLog = true,
}: Options) {
  if (!options) {
    throw new Error(
      `Options for ${referenceName} don't exist. Make sure that it exists.`
    )
  }
  const outPath = outputType === "json" ? options.json : options.out

  if (!outPath) {
    throw new Error(
      `Options for ${referenceName} don't include ${
        outPath === "json" ? "json" : "an out"
      } file. Please add an ${
        outputType === "json" ? "`json`" : "`out`"
      } option and try again.`
    )
  }

  const colorLog = chalk.hex(randomColor())

  if (startLog) {
    formatColoredLog({
      chalkInstance: colorLog,
      title: referenceName,
      message: "Generating reference...",
    })
  }

  const typedocApp = await Application.bootstrapWithPlugins(options)

  const project = await typedocApp.convert()

  if (!project) {
    throw new Error(
      `Generating reference for ${referenceName} failed. Check logs for any errors.`
    )
  }

  if (outputType === "json") {
    await typedocApp.generateJson(project, outPath)
  } else {
    await typedocApp.generateDocs(project, outPath)
  }
}
