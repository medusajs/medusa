import type { BuildManifest } from "@medusajs/framework/utils"

/**
 * Rewrites every file path in the manifest to its relocatable key.
 */
export function keyManifest(
  manifest: BuildManifest,
  toKey: (file: string) => string
) {
  const rekey = <T>(record?: Record<string, T>) =>
    record &&
    Object.fromEntries(
      Object.entries(record).map(([file, v]) => [toKey(file), v])
    )

  return {
    ...manifest,
    routes: rekey(manifest.routes),
    subscribers: rekey(manifest.subscribers),
    middlewares: rekey(manifest.middlewares),
    workflows:
      manifest.workflows &&
      Object.fromEntries(
        Object.entries(manifest.workflows).map(([id, file]) => [
          id,
          toKey(file),
        ])
      ),
    lazyWorkflowFiles: manifest.lazyWorkflowFiles?.map(toKey),
    workflowHooks:
      manifest.workflowHooks &&
      Object.fromEntries(
        Object.entries(manifest.workflowHooks).map(([id, files]) => [
          id,
          files.map(toKey),
        ])
      ),
  }
}
