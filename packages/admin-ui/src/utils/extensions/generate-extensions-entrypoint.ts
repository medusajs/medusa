import { LoadedExtension } from "../../types/extensions"

import path from "path"

export async function generateExtensionsEntrypoint(
  extensions: LoadedExtension[],
  dest: string
) {
  const imports = extensions.map((extension, i) => {
    const relativePath = path.relative(path.dirname(dest), extension.path)

    return `import ${extension.name}${i} from './${relativePath}';`
  })

  const exports = `export const plugins = [${extensions
    .map((extension, i) => {
      return `${extension.name}${i}`
    })
    .join(",")}]`

  return `${imports.join("")}${exports}`
}
