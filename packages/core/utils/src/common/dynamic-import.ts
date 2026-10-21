import { isFileDisabled, MEDUSA_SKIP_FILE } from "./define-file-config"
import { resolveExports } from "./resolve-exports"

/**
 * A loader the dev server can install to take over loading project source
 * files (e.g. through Vite's module runner). Dependencies and anything the
 * loader doesn't claim keep going through `require`.
 */
export interface MedusaModuleLoader {
  canLoad(path: string): boolean
  import(path: string): Promise<any>
}

const MODULE_LOADER_KEY = "__MEDUSA_MODULE_LOADER__"

export function setModuleLoader(loader: MedusaModuleLoader | undefined) {
  ;(globalThis as any)[MODULE_LOADER_KEY] = loader
}

export function getModuleLoader(): MedusaModuleLoader | undefined {
  return (globalThis as any)[MODULE_LOADER_KEY]
}

/**
 * Utility that should be used instead of either await import() or require()
 * to avoid bundling issues. That way we have a single place
 * where we manage the strategy to dynamically import a module.
 *
 * This issue arise from migration to Node16 or NodeNext module resolution as well
 * as ts-node not being maintained anymore and throwing deprecation warnings.
 * all over the place.
 *
 * @param path
 */
export async function dynamicImport(path: string): Promise<any> {
  const loader = getModuleLoader()
  const module = loader?.canLoad(path)
    ? await loader.import(path)
    : require(path)

  let exported = resolveExports(module)

  if (isFileDisabled(path)) {
    // Module namespaces from a module loader are sealed
    if (!Object.isExtensible(exported)) {
      exported = { ...exported }
    }
    exported[MEDUSA_SKIP_FILE] = true
  }

  return exported
}
