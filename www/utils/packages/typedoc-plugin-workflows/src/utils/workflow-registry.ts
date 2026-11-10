import {
  getWorkflowChildren,
  getWorkflowDefinition,
  isWorkflow,
} from "@medusajs/framework/workflows-sdk"

export type WorkflowDefinition = ReturnType<typeof getWorkflowDefinition>

/**
 * The packages whose exported workflows are documented.
 */
const WORKFLOW_PACKAGES = [
  "@medusajs/core-flows",
  "@medusajs/loyalty-plugin/workflows",
]

/**
 * Workflow definitions by ID, collected from the exports of the documented
 * packages since there's no global workflows registry.
 */
export default class WorkflowRegistry {
  protected definitions = new Map<string, WorkflowDefinition>()

  async load() {
    for (const packageName of WORKFLOW_PACKAGES) {
      try {
        const exported = await import(packageName)
        this.register(Object.values(exported))
        // CommonJS packages expose their exports on `default`.
        if (exported.default && typeof exported.default === "object") {
          this.register(Object.values(exported.default))
        }
      } catch (e) {
        console.warn(
          `Couldn't load workflows from ${packageName}. Make sure it's installed and built to generate references for its workflows.`
        )
      }
    }
  }

  register(values: unknown[]) {
    for (const value of values) {
      if (!isWorkflow(value)) {
        continue
      }

      const definition = getWorkflowDefinition(value)
      if (this.definitions.has(definition.id)) {
        continue
      }

      this.definitions.set(definition.id, definition)
      // workflows used with `runAsStep` may not be exported
      this.register(getWorkflowChildren(value))
    }
  }

  get(workflowId: string): WorkflowDefinition | undefined {
    return this.definitions.get(workflowId)
  }

  hasStep(workflow: WorkflowDefinition, stepId: string): boolean {
    return workflow.steps.some((step) => step.id === stepId)
  }
}
