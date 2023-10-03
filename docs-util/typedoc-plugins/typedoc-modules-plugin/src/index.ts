import { Application } from "typedoc";
import { load as resolveReferencesPluginLoad } from "./resolve-references-plugin"
import { load as convertLinkToSectionPlugin } from "./convert-link-to-section-plugin"

export function load(app: Application) {
  resolveReferencesPluginLoad(app)
  // convertLinkToSectionPlugin(app)
}