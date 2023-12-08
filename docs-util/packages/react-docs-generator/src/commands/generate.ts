import path from "path"
import readFiles from "../utils/read-files.js"
import { parse } from "react-docgen"
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs"
import TypedocManager from "../classes/typedoc-manager.js"
import chalk from "chalk"
import CustomResolver from "../classes/custom-resolver.js"

type GenerateOptions = {
  src: string
  output: string
  clean?: boolean
  tsconfigPath: string
  disableTypedoc: boolean
  verboseTypedoc: boolean
}

export default async function ({
  src,
  output,
  clean,
  tsconfigPath,
  disableTypedoc,
  verboseTypedoc,
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
    disable: disableTypedoc,
    verbose: verboseTypedoc,
  })

  // use typedoc to retrieve signatures which can be used later
  // to find missing description/types
  await typedocManager.setup(src)

  for (const [filePath, fileContent] of fileContents) {
    try {
      const relativePath = path.resolve(filePath)
      const specs = parse(fileContent, {
        filename: relativePath,
        resolver: new CustomResolver(typedocManager),
        babelOptions: {
          ast: true,
        },
      })

      specs.forEach((spec) => {
        if (!spec.displayName) {
          return
        }
        const specNameSplit = spec.displayName.split(".")
        let filePath = output

        spec = typedocManager.tryFillWithTypedocData(spec, specNameSplit)

        // put the specs in a sub-directory
        filePath = path.join(filePath, specNameSplit[0])
        if (!existsSync(filePath)) {
          mkdirSync(filePath)
        }

        // write spec to output path
        writeFileSync(
          path.join(filePath, `${spec.displayName}.json`),
          JSON.stringify(spec, null, 2)
        )

        console.log(chalk.green(`Created spec file for ${spec.displayName}.`))
      })
    } catch (e) {
      console.error(chalk.red(`Failed to parse ${filePath}: ${e}`))
    }
  }
}
