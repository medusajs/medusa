import { LoadedExtension } from "../../types/extensions"
import { pathToRelativeUrl } from "./path-to-relative-url"

import path from "path"

export async function generateExtensionsEntrypoint(
  extensions: LoadedExtension[]
) {
  const imports = extensions.map((extension, i) => {
    return `import "${extension.name}${i}" from './${pathToRelativeUrl(
      path.resolve(extension.path, extension.entrypoint)
    )}';`
  })

  const exports = extensions.map((extension, i) => {
    return `export { ${extension.name}${i} };`
  })

  return `${imports.join("")}${exports.join("")}`
}
