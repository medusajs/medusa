import path from "path"
import readFiles from "../utils/read-files.js"
import { builtinHandlers, parse } from "react-docgen"
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs"
import TypedocManager from "../classes/typedoc-manager.js"
import chalk from "chalk"
import CustomResolver from "../resolvers/custom-resolver.js"
import argsPropHandler from "../handlers/argsPropHandler.js"

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

  // create output directory if it doesn't exist
  if (!outputExists) {
    mkdirSync(output)
  }

  // optionally use typedoc to add missing props, descriptions
  // or types.
  const typedocManager = new TypedocManager({
    tsconfigPath,
    disable: disableTypedoc,
    verbose: verboseTypedoc,
  })

  await typedocManager.setup(src)

  for (const [filePath, fileContent] of fileContents) {
    try {
      const relativePath = path.resolve(filePath)
      // retrieve the specs of a file
      const specs = parse(fileContent, {
        filename: relativePath,
        resolver: new CustomResolver(typedocManager),
        handlers: [
          // Built-in handlers
          builtinHandlers.childContextTypeHandler,
          builtinHandlers.codeTypeHandler,
          builtinHandlers.componentDocblockHandler,
          builtinHandlers.componentMethodsHandler,
          builtinHandlers.contextTypeHandler,
          builtinHandlers.defaultPropsHandler,
          builtinHandlers.displayNameHandler,
          builtinHandlers.propDocblockHandler,
          builtinHandlers.propTypeCompositionHandler,
          builtinHandlers.propTypeHandler,
          // Custom handlers
          (documentation, componentPath) =>
            argsPropHandler(documentation, componentPath, typedocManager),
        ],
        babelOptions: {
          ast: true,
        },
      })

      // write each of the specs into output directory
      specs.forEach((spec) => {
        if (!spec.displayName) {
          return
        }
        const specNameSplit = spec.displayName.split(".")
        let filePath = output

        if (spec.description) {
          spec.description = typedocManager.normalizeDescription(
            spec.description
          )
        }

        // if typedoc isn't disabled, this method will try to fill
        // missing descriptions and types, and add missing props.
        spec = typedocManager.tryFillWithTypedocData(spec, specNameSplit)

        // put the spec in a sub-directory
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
