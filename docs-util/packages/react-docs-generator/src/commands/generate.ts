import path from "path"
import readFiles from "../utils/read-files.js"
import { parse, builtinResolvers } from "react-docgen"
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs"

type GenerateOptions = {
  src: string
  output: string
  clean?: boolean
}

export default function ({ src, output, clean }: GenerateOptions) {
  const fileContents = readFiles(src)
  let outputExists = existsSync(output)

  if (clean && outputExists) {
    // remove the directory which will be created in the next condition block
    rmSync(output, { recursive: true, force: true })
    outputExists = false
  }

  // create out directory if it doesn't exist
  if (!outputExists) {
    mkdirSync(output)
  }

  fileContents.forEach((fileContent, filePath) => {
    try {
      const specs = parse(fileContent, {
        filename: path.resolve(filePath),
        resolver: new builtinResolvers.FindAllDefinitionsResolver(),
      })

      specs.forEach((spec) => {
        const specName =
          spec.displayName ?? path.parse(path.basename(fileContent)).name
        const specNameSplit = specName.split(".")
        let filePath = output

        // put the specs in a sub-directory
        filePath = path.join(filePath, specNameSplit[0])
        if (!existsSync(filePath)) {
          mkdirSync(filePath)
        }

        // write spec to output path
        writeFileSync(
          path.join(filePath, `${specName}.json`),
          JSON.stringify(spec, null, 2)
        )
      })
    } catch (e) {
      console.error(`Failed to parse ${filePath}: ${e}`)
    }
  })
}
