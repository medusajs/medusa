import path from "path"
import readFiles from "../utils/read-files.js"
import { parse, builtinResolvers } from "react-docgen"
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs"
import TypedocManager from "../classes/TypedocManager.js"

type GenerateOptions = {
  src: string
  output: string
  clean?: boolean
  tsconfigPath: string
}

export default async function ({
  src,
  output,
  clean,
  tsconfigPath,
}: GenerateOptions) {
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

  const typedocManager = new TypedocManager({
    tsconfigPath,
  })

  // use typedoc to retrieve signatures which can be used later
  // to find missing description/types
  await typedocManager.setup(src)

  for (const [filePath, fileContent] of fileContents) {
    try {
      const relativePath = path.resolve(filePath)
      const specs = parse(fileContent, {
        filename: relativePath,
        resolver: new builtinResolvers.FindAllDefinitionsResolver(),
        babelOptions: {
          ast: true,
        },
      })

      specs.forEach((spec) => {
        const specName =
          spec.displayName ?? path.parse(path.basename(fileContent)).name
        const specNameSplit = specName.split(".")
        let filePath = output

        spec = typedocManager.tryFillWithTypedocData(spec, specNameSplit)

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
  }
}
