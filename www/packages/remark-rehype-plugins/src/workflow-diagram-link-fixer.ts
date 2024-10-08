import { Transformer } from "unified"
import { ComponentLinkFixerOptions } from "./types/index.js"
import { componentLinkFixer } from "./utils/component-link-fixer.js"

export function workflowDiagramLinkFixerPlugin(
  options?: ComponentLinkFixerOptions
): Transformer {
  return componentLinkFixer("WorkflowDiagram", "workflow", options)
}
