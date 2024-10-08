import { Transformer } from "unified"
import { ComponentLinkFixerOptions } from "./types/index.js"
import { componentLinkFixer } from "./utils/component-link-fixer.js"

export function typeListLinkFixerPlugin(
  options?: ComponentLinkFixerOptions
): Transformer {
  return componentLinkFixer("TypeList", "types", options)
}
