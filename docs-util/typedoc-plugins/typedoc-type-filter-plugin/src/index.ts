import { Application } from "typedoc"
import { ReferenceTypePlugin } from "./plugin.js"

export function load(app: Application) {
  new ReferenceTypePlugin().initialize(app)
}
