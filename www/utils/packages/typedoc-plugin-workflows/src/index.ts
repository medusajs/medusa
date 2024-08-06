import { Application } from "typedoc"
import WorkflowsPlugin from "./plugin"

export function load(app: Application) {
  new WorkflowsPlugin(app)
}
