import fse from "fs-extra"
import { resolve } from "path"
import prompts from "prompts"

export async function exportUi() {
  const results = await prompts([
    {
      type: "text",
      name: "backendUrl",
      message: "What is the backend URL?",
      validate: async (value: string) => {
        try {
          const url = new URL(value)

          if (url.protocol !== "https:") {
          }

          return true
        } catch (_error) {
          return "Please enter a valid URL"
        }
      },
    },
    {
      type: "text",
      name: "outDir",
      message: "Where should the build be exported to?",
      initial: "./build",
    },
    {
      type: "text",
      name: "base",
      message: "Do you want to set a base path?",
    },
  ])

  const { outDir, backendUrl, base } = results

  let path = resolve(process.cwd(), outDir)
  let overwrite = false

  const exists = await fse.pathExists(path)

  if (exists) {
    const { path: newPath, force } = await onPathExists(path)

    path = newPath
    overwrite = force
  }

  // await buildUi({
  //   backendUrl: backendUrl,
  //   outDir: path,
  //   base: base,
  //   force: overwrite,
  // })

  console.log("Options", { backendUrl, path, base, overwrite })
}

const onPathExists = async (
  path: string
): Promise<{ path: string; force: boolean }> => {
  let newPath = path
  let force = false

  const { overwrite } = await prompts({
    type: "confirm",
    name: "overwrite",
    message: `The directory ${path} already exists. Do you want to overwrite it?`,
  })

  if (!overwrite) {
    const { newPath: newP } = await prompts({
      type: "text",
      name: "newPath",
      message: "Please enter a new path",
    })

    const exists = await validateOutDir(newP)

    if (exists) {
      return await onPathExists(newP)
    }

    newPath = newP
  }

  force = overwrite

  return { path: newPath, force }
}

const validateOutDir = async (path: string) => {
  const absolutePath = resolve(process.cwd(), path)

  return await fse.pathExists(absolutePath)
}
