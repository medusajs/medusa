import path from "path"
import readFiles from "../utils/read-files.js"
import { parse, builtinResolvers } from "react-docgen"
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs"
import { DeclarationReflection } from "typedoc"
import { getTypeChildren } from "utils"
import getDisplayNamesMapping from "../utils/get-display-names-mapping.js"
import getTsType from "../utils/get-ts-type.js"
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
  const { project: typedocProject, mappedReflectionSignatures } =
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
      // store the display names along with their variable name
      // to access the variable name later.
      const mappedDisplayNames = getDisplayNamesMapping(fileContent)

      specs.forEach((spec) => {
        const specName =
          spec.displayName ?? path.parse(path.basename(fileContent)).name
        const specNameSplit = specName.split(".")
        let filePath = output
        const mappedVarName = mappedDisplayNames.get(specName)

        if (spec.props && mappedVarName) {
          // check if any props need their type/description derived
          // using typedoc
          const reflection = typedocProject?.getChildByName(
            mappedVarName
          ) as DeclarationReflection
          if (!reflection) {
            console.log(mappedVarName, specName)
          }
          const mappedSignature = reflection.sources?.length
            ? mappedReflectionSignatures.find(({ source }) => {
                return (
                  source.fileName === reflection.sources![0].fileName &&
                  source.line === reflection.sources![0].line &&
                  source.character === reflection.sources![0].character
                )
              })
            : undefined

          if (
            mappedSignature?.signatures[0].parameters?.length &&
            mappedSignature.signatures[0].parameters[0].type
          ) {
            const props = getTypeChildren(
              mappedSignature.signatures[0].parameters[0].type,
              typedocProject
            )
            Object.entries(spec.props).forEach(([propName, propDetails]) => {
              const reflectionPropType = props.find(
                (propType) => propType.name === propName
              )
              if (reflectionPropType) {
                if (
                  !propDetails.description &&
                  reflectionPropType.comment?.summary
                ) {
                  propDetails.description = reflectionPropType.comment.summary
                    .map(({ text }) => text)
                    .join(" ")
                }
                if (!propDetails.tsType && reflectionPropType.type) {
                  propDetails.tsType = getTsType(reflectionPropType.type)
                }
              }
            })
          }
        }

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
