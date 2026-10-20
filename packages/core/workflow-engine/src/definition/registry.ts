import { DefinitionConflictError, WorkflowNotRegisteredError } from "../errors"
import { compile, CompiledWorkflow } from "./compile"
import { WorkflowDefinition } from "./types"

export class WorkflowRegistry {
  #workflows = new Map<string, CompiledWorkflow>()

  /**
   * Registering the same shape again is a no-op. A different shape under the
   * same id throws.
   */
  register(definition: WorkflowDefinition): CompiledWorkflow {
    const compiled = compile(definition)
    const existing = this.#workflows.get(compiled.id)

    if (existing) {
      if (existing.hash !== compiled.hash) {
        throw new DefinitionConflictError(compiled.id)
      }
      return existing
    }

    this.#workflows.set(compiled.id, compiled)
    return compiled
  }

  unregister(workflowId: string): void {
    this.#workflows.delete(workflowId)
  }

  has(workflowId: string): boolean {
    return this.#workflows.has(workflowId)
  }

  find(workflowId: string): CompiledWorkflow | undefined {
    return this.#workflows.get(workflowId)
  }

  get(workflowId: string): CompiledWorkflow {
    const compiled = this.#workflows.get(workflowId)
    if (!compiled) {
      throw new WorkflowNotRegisteredError(workflowId)
    }
    return compiled
  }

  list(): CompiledWorkflow[] {
    return [...this.#workflows.values()]
  }
}
