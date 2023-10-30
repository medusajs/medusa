import { Application } from "typedoc"
import { load as resolveReferencesPluginLoad } from "./resolve-references-plugin"

export function load(app: Application) {
  resolveReferencesPluginLoad(app)
}
