import { InputFileConfig } from "@zjedene-medusa/types"
import { getCallerFilePath } from "./get-caller-file-path"

export const MEDUSA_SKIP_FILE = Symbol.for("__MEDUSA_SKIP_FILE__")
/**
 * The "defineFileConfig" helper can be used to define the configuration
 * of any file auto-loaded by Medusa.
 *
 * It is used to avoid loading files that are not required. Like a feature flag
 * that is disabled.
 */
const FILE_CONFIGS = new Map()
export function defineFileConfig(config?: InputFileConfig) {
  const filePath = config?.path ?? getCallerFilePath()
  FILE_CONFIGS.set(filePath, config)
}

export function getDefinedFileConfig(path?: string) {
  return FILE_CONFIGS.get(path)
}

export function isFileDisabled(path?: string) {
  return !!getDefinedFileConfig(path)?.isDisabled?.()
}

export function isFileSkipped(exported: unknown) {
  return !!exported?.[MEDUSA_SKIP_FILE]
}
