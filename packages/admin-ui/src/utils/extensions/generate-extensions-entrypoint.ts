import path from "path"

export async function generateExtensionsEntrypoint(
  extensions: string,
  dest: string
) {
  try {
    if (!extensions) {
      throw new Error("No extensions found")
    }

    const relativePath = path.relative(path.dirname(dest), extensions)

    const imports = `import extension from "${relativePath}"`

    const exports = `export const plugins = [extension]`

    const content = `
    ${imports}

    ${exports}

    export default plugins
  `

    return content
  } catch (e) {
    console.log("Failed to generate extensions entrypoint")
    throw new Error(e)
  }
}
