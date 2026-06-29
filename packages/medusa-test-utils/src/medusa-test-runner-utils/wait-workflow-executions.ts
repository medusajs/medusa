import { Modules } from "@medusajs/framework/utils"
import { MedusaContainer } from "@medusajs/framework/types"

/**
 * Waits for all workflow executions to finish. When relying on workflows but not necessarily
 * waiting for them to finish, this can be used to ensure that a test is not considered done while background executions are still running and can interfere with the other tests.
 * @param container - The container instance.
 * @returns A promise that resolves when all workflow executions have finished.
 */
export async function waitWorkflowExecutions(container: MedusaContainer) {
  const wfe = container.resolve(Modules.WORKFLOW_ENGINE, {
    allowUnregistered: true,
  })
  if (!wfe) {
    return
  }

  const timeout = setTimeout(() => {
    throw new Error("Timeout waiting for workflow executions to finish")
  }, 60000).unref()

  // An event -> subscriber -> workflow cascade runs through several unawaited
  // async hops, so a follow-on workflow's execution row can appear shortly
  // after the parent's row disappears. Observing zero non-terminal executions
  // once is therefore not enough: require a few consecutive empty observations
  // so a transient gap doesn't end the wait while a background workflow is still
  // imminent and would otherwise race the per-test database reset.
  const requiredQuiescentChecks = 5
  let quiescentChecks = 0
  let waitWorkflowsToFinish = true
  while (waitWorkflowsToFinish) {
    const executions = await wfe.listWorkflowExecutions({
      state: { $nin: ["not_started", "done", "reverted", "failed"] },
    })

    quiescentChecks = executions.length === 0 ? quiescentChecks + 1 : 0

    if (quiescentChecks >= requiredQuiescentChecks) {
      waitWorkflowsToFinish = false
      clearTimeout(timeout)
      break
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
}
