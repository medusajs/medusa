import { Application } from "typedoc"
import { load as resolveReferencesPluginLoad } from "./resolve-references-plugin"
import { load as frontmatterPlugin } from "./frontmatter-plugin"
import { load as parseOasSchemaPlugin } from "./parse-oas-schema-plugin"

export function load(app: Application) {
  resolveReferencesPluginLoad(app)
  frontmatterPlugin(app)
  parseOasSchemaPlugin(app)
}
