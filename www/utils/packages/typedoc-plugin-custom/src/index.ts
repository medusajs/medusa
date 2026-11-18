import { Application } from "typedoc"
import { load as resolveReferencesPluginLoad } from "./resolve-references-plugin.js"
import { load as frontmatterPlugin } from "./frontmatter-plugin.js"
import { load as parseOasSchemaPlugin } from "./parse-oas-schema-plugin.js"
import { load as apiIgnorePlugin } from "./api-ignore.js"
import { load as eslintExamplePlugin } from "./eslint-example.js"
import { load as signatureModifierPlugin } from "./signature-modifier.js"
import { MermaidDiagramGenerator } from "./mermaid-diagram-generator.js"
import { load as parentIgnorePlugin } from "./parent-ignore.js"
import { load as generateNamespacePlugin } from "./generate-path-namespaces.js"
import { DmlRelationsResolver } from "./dml-relations-resolver.js"
import { load as dmlTypesNormalizer } from "./dml-types-normalizer.js"
import { MermaidDiagramDMLGenerator } from "./mermaid-diagram-dml-generator.js"
import { load as dmlJsonParser } from "./dml-json-parser.js"
import { GenerateCustomNamespacePlugin } from "./generate-custom-namespaces.js"
import { EventsResolver } from "./events-resolver.js"
import { load as legacyConversionPlugin } from "./legacy-conversion.js"

export function load(app: Application) {
  legacyConversionPlugin(app)
  resolveReferencesPluginLoad(app)
  frontmatterPlugin(app)
  parseOasSchemaPlugin(app)
  apiIgnorePlugin(app)
  eslintExamplePlugin(app)
  signatureModifierPlugin(app)
  parentIgnorePlugin(app)
  dmlTypesNormalizer(app)
  dmlJsonParser(app)
  generateNamespacePlugin(app)

  new MermaidDiagramGenerator(app)
  new DmlRelationsResolver(app)
  new MermaidDiagramDMLGenerator(app)
  new GenerateCustomNamespacePlugin(app)
  new EventsResolver(app)
}
