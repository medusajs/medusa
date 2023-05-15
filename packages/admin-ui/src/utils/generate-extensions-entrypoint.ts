import dedent from "dedent"
import path from "path"

export async function generateExtensionsEntrypoint(
  extensions: string[] | null,
  dest: string
) {
  try {
    if (!extensions) {
      throw new Error("No extensions found")
    }

    const relativePaths = extensions.map((e) => {
      return path.relative(path.dirname(dest), e)
    })

    const imports = relativePaths
      .map((p, i) => {
        return `import ext${i} from "${p}"`
      })
      .join("\n")

    const exports = `export const extensions = [${relativePaths
      .map((_, i) => {
        return `ext${i}`
      })
      .join(", ")}]`

    const content = dedent`
    ${imports}

    ${exports}

    export default extensions
    
  `

    return content
  } catch (e) {
    console.log("Failed to generate extensions entrypoint")
    throw new Error(e)
  }
}
