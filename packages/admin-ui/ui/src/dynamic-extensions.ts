import { ExtensionsEntry } from "@medusajs/admin-shared"

let exts: ExtensionsEntry[] = []

if (module.hot) {
  module.hot.accept((err) => {
    if (err) {
      console.error(
        `Cannot apply hot update to "./src/dynamic-extensions.ts":`,
        err
      )
    }
  })

  module.hot.dispose((data) => {
    // Preserve the previous extensions before the module is replaced
    data.prevExtensions = exts
  })

  if (module.hot.data && module.hot.data.prevExtensions) {
    // If there are previous extensions, use them before calling loadExtensions
    exts = module.hot.data.prevExtensions
  }
}

export async function loadExtensions() {
  try {
    const { default: extensions } = await import("./extensions")
    exts = extensions as ExtensionsEntry[]
  } catch (_) {
    // noop - no extensions
  }
}

export function getExtensions() {
  return exts
}
