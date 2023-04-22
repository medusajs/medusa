import { LoadedExtension } from "../../types/extensions"

import path from "path"

export async function generateExtensionsEntrypoint(
  extensions: LoadedExtension[],
  dest: string
) {
  const imports = extensions
    .map((extension, i) => {
      const relativePath = path.relative(path.dirname(dest), extension.path)

      return `import ${extension.name}${i} from './${relativePath}';`
    })
    .join("\n")

  const exports = `const plugins = {${extensions
    .map((extension, i) => {
      return `Component${i}: ${extension.name}${i},`
    })
    .join("\n")}
    }`

  const content = `
    ${imports}

    ${exports}

    export default plugins
  `

  return content
}
