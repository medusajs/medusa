import { readdir, readFile } from "fs/promises"
import path from "path"

export default async function docusaurusPluginDiagram2codeShowcase(
  context,
  { directoryPath, routePaths }
) {
  // ...
  return {
    name: "docusaurus-plugin-diagram2code-showcase",
    async loadContent() {
      const specs = {}
      // read files under the provided directory path
      const diagramSpecDirectories = (
        await readdir(directoryPath, { withFileTypes: true })
      ).filter((dirent) => dirent.isDirectory())

      diagramSpecDirectories.forEach(async (dirent) => {
        const tempSpecs = {}(
          await readdir(dirent.path, { withFileTypes: true })
        )
          .filter((specDirent) => specDirent.isDirectory())
          .forEach(async (specDirent) => {
            // read the diagram and code files
            const diagram = readIfExists(
              path.join(specDirent.path, "diagram.mermaid")
            )
            const code =
              readIfExists(path.join(specDirent.path, "code.ts")) ||
              readIfExists(path.join(specDirent.path, "code.tsx")) ||
              readIfExists(path.join(specDirent.path, "code.js"))

            if (!diagram || !code) {
              return
            }

            tempSpecs[specDirent.name] = {
              diagram,
              code,
            }
          })

        if (Object.keys(tempSpecs).length) {
          specs[dirent.name] = tempSpecs
        }
      })

      return specs
    },
    async contentLoaded({ content, actions }) {
      const { createData, addRoute } = actions
      Object.entries(content).forEach(async ([name, specs]) => {
        const specsJsonPath = await createData(
          `${name}.json`,
          JSON.stringify(specs)
        )

        addRoute({
          path: Object.hasOwn(routePaths, name)
            ? routePaths[name].path
            : `/showcase/${name}`,
          component: Object.hasOwn(routePaths, name)
            ? routePaths[name].component
            : `@site/src/components/Diagram2CodeShowcase`,
          modules: {
            specs: specsJsonPath,
          },
          exact: true,
        })
      })
    },
  }
}

async function readIfExists(filePath) {
  try {
    return await readFile(filePath, "utf-8")
  } catch {
    return null
  }
}
