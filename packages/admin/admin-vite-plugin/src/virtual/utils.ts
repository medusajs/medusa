import { VIRTUAL_MODULE_PREFIX } from "./constants"

export function isVirtualModule(id: string) {
  return id.startsWith(VIRTUAL_MODULE_PREFIX)
}
