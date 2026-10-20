import { Application } from "typedoc"
import WorkflowsPlugin from "./plugin.js"
import WorkflowRegistry from "./utils/workflow-registry.js"

export async function load(app: Application) {
  const workflowRegistry = new WorkflowRegistry()
  await workflowRegistry.load()
  new WorkflowsPlugin(app, workflowRegistry)
}
