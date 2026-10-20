import { InvalidDefinitionError } from "../errors"
import { WorkflowDefinition } from "./types"

export function validateDefinition(definition: WorkflowDefinition): void {
  if (!definition.id) {
    throw new InvalidDefinitionError("A workflow definition needs an id")
  }

  const seen = new Set<string>()

  for (const step of definition.steps) {
    if (!step.id) {
      throw new InvalidDefinitionError(
        `Workflow "${definition.id}" has a step without an id`
      )
    }

    if (seen.has(step.id)) {
      throw new InvalidDefinitionError(
        `Workflow "${definition.id}" has more than one step with id "${step.id}"`
      )
    }

    // Requiring dependencies to be declared first rules out cycles.
    for (const dependency of step.dependsOn) {
      if (!seen.has(dependency)) {
        throw new InvalidDefinitionError(
          `Step "${step.id}" in workflow "${definition.id}" depends on "${dependency}", which is not declared before it`
        )
      }
    }

    const { maxRetries, retryIntervalMs, timeoutMs } = step.options
    for (const [name, value] of Object.entries({
      maxRetries,
      retryIntervalMs,
      timeoutMs,
    })) {
      if (value !== undefined && (typeof value !== "number" || value < 0)) {
        throw new InvalidDefinitionError(
          `Step "${step.id}" in workflow "${definition.id}" has an invalid ${name}`
        )
      }
    }

    seen.add(step.id)
  }

  for (const step of definition.steps) {
    const target = step.options.skipOnPermanentFailure
    if (typeof target === "string" && !seen.has(target)) {
      throw new InvalidDefinitionError(
        `Step "${step.id}" in workflow "${definition.id}" skips to unknown step "${target}"`
      )
    }
  }
}
