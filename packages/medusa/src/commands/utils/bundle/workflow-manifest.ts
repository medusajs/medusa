import path from "path"

export type HookRegistration = { workflowId: string; file?: string }

/**
 * Which workflow files a bundle loads at boot and which on first use, from
 * what the collection pass recorded:
 *
 * - files defining workflows load when one of their workflows is first used
 * - files registering hooks on a workflow load before it first runs
 * - files that must keep loading at boot stay out of both:
 *   - configured ones (`defineFileConfig`): whether they're enabled is
 *     decided at runtime, and the loader unregisters disabled workflows
 *   - ones defining scheduled workflows, which schedule themselves when
 *     defined
 */
export function buildWorkflowManifest({
  workflowFiles,
  scheduledWorkflows,
  hookRegistrations,
  workflowDirs,
  hasFileConfig,
}: {
  /** Workflow id -> the file defining it */
  workflowFiles: Map<string, string>
  scheduledWorkflows: Set<string>
  hookRegistrations: HookRegistration[]
  /** The folders workflows are loaded from */
  workflowDirs: string[]
  hasFileConfig: (file: string) => boolean
}) {
  const workflows: Record<string, string> = {}
  const lazyWorkflowFiles = new Set<string>()
  const workflowHooks: Record<string, string[]> = {}
  const kept: Record<string, string> = {}

  const eagerFiles = new Set<string>()
  for (const [workflowId, file] of workflowFiles) {
    if (hasFileConfig(file)) {
      kept[file] = "workflow: has a file config"
      eagerFiles.add(file)
    } else if (scheduledWorkflows.has(workflowId)) {
      kept[file] = "workflow: scheduled"
      eagerFiles.add(file)
    }
  }

  for (const [workflowId, file] of workflowFiles) {
    if (eagerFiles.has(file)) {
      continue
    }
    workflows[workflowId] = file
    if (workflowDirs.some((dir) => file.startsWith(dir + path.sep))) {
      lazyWorkflowFiles.add(file)
    }
  }

  for (const { workflowId, file } of hookRegistrations) {
    // A file registering a hook on a workflow it defines loads with it
    if (
      !file ||
      workflowFiles.get(workflowId) === file ||
      hasFileConfig(file)
    ) {
      continue
    }
    const files = (workflowHooks[workflowId] ??= [])
    if (!files.includes(file)) {
      files.push(file)
    }
    // Loading it before the workflow runs is harmless for files that load
    // at boot anyway, but they must not become lazy
    if (!eagerFiles.has(file)) {
      lazyWorkflowFiles.add(file)
    }
  }

  return {
    workflows,
    lazyWorkflowFiles: [...lazyWorkflowFiles],
    workflowHooks,
    kept,
  }
}
