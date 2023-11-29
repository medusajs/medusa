import { exec } from "child_process"
import { Dirent } from "fs"
import { readdir, readFile, writeFile } from "fs/promises"
import path from "path"

export default async function docusaurusPluginDiagram2codeShowcase(
  context,
  { directoryPath, outputPath, debug = false }
) {
  async function readIfExists(filePath) {
    try {
      return await readFile(filePath, "utf-8")
    } catch (e) {
      if (debug) {
        console.error(
          `[Diagram2Code Showcase Plugin] An error occurred while reading ${filePath}: ${e}`
        )
      }
      return null
    }
  }

  async function generateSpecs() {
    let specs = {}
    let diagramSpecDirectories = []

    try {
      // read files under the provided directory path
      diagramSpecDirectories = (
        await readdir(directoryPath, { withFileTypes: true })
      ).filter((dirent) => dirent.isDirectory())
    } catch {
      console.error(
        `Directory ${directoryPath} doesn't exist. Skipping reading diagrams...`
      )
      return
    }

    await Promise.all(
      diagramSpecDirectories.map(async (dirent) => {
        const tempSpecs = {}
        const specsPath = path.join(directoryPath, dirent.name)

        const specDirents = (
          await readdir(specsPath, { withFileTypes: true })
        ).filter((specDirent) => specDirent.isDirectory())
        await Promise.all(
          specDirents.map(async (specDirent) => {
            const specPath = path.join(specsPath, specDirent.name)
            // read the diagram and code files
            const diagram = await readIfExists(
              path.join(specPath, "diagram.mermaid")
            )
            const code =
              (await readIfExists(path.join(specPath, "code.ts"))) ||
              (await readIfExists(path.join(specPath, "code.tsx"))) ||
              (await readIfExists(path.join(specPath, "code.js")))

            if (!diagram) {
              return
            }

            tempSpecs[specDirent.name] = {
              diagram,
              code,
            }
          })
        )

        if (Object.keys(tempSpecs).length) {
          specs[dirent.name] = tempSpecs
        }
      })
    )

    // order steps alphabetically
    specs = Object.keys(specs)
      .sort()
      .reduce((accumulator, key) => {
        accumulator[key] = specs[key]

        return accumulator
      }, {})

    // store specs in a JavaScript object that can be consumed
    const specOutputFilePath = path.join(outputPath, "specs.ts")
    await writeFile(
      specOutputFilePath,
      `export const specs = ${JSON.stringify(specs, null, "\t")}`
    )

    // execute eslint
    exec(`eslint ${specOutputFilePath} --fix`)

    return specOutputFilePath
  }

  return {
    name: "docusaurus-plugin-diagram2code-showcase",
    async loadContent() {
      await generateSpecs()
    },
    extendCli(cli) {
      cli
        .command("diagram2code:generate")
        .description(
          "Generate the spec file used to create diagram-to-code showcase"
        )
        .action(async () => {
          const specFile = await generateSpecs()
          // eslint-disable-next-line no-console
          console.log(`Generated diagram2code spec file at ${specFile}`)
        })
    },
    getPathsToWatch() {
      return [directoryPath]
    },
  }
}
