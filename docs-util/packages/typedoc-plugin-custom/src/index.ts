import { Application } from "typedoc"
import { load as resolveReferencesPluginLoad } from "./resolve-references-plugin"
import { load as frontmatterPlugin } from "./frontmatter-plugin"
import { load as parseOasSchemaPlugin } from "./parse-oas-schema-plugin"
import { load as apiIgnorePlugin } from "./api-ignore"
import { load as eslintExamplePlugin } from "./eslint-example"
import { load as signatureModifierPlugin } from "./signature-modifier"

export function load(app: Application) {
  resolveReferencesPluginLoad(app)
  frontmatterPlugin(app)
  parseOasSchemaPlugin(app)
  apiIgnorePlugin(app)
  eslintExamplePlugin(app)
  signatureModifierPlugin(app)
}
