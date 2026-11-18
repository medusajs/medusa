import { Transformer } from "unified"
import { ComponentLinkFixerOptions } from "types"
import { componentLinkFixer } from "./utils/component-link-fixer.js"

export function enterpriseNoticeLinkFixerPlugin(
  options?: ComponentLinkFixerOptions
): Transformer {
  return componentLinkFixer("EnterpriseNotice", "featureFlagHref", options)
}
