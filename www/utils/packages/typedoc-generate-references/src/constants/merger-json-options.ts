import { TypeDocOptions } from "typedoc"
import path from "path"
import { rootPathPrefix } from "./general.js"
import mergerOptions from "./merger-options.js"

/**
 * Merge-phase options that emit the references doc-model (`DocPage` JSON) via
 * the `json` theme. This is the only reference output — MDX is no longer
 * generated.
 *
 * It reuses every setting from {@link mergerOptions} (entry points, the
 * regex-keyed `formatting` map, `allowedProjectDocuments`, `maxLevel`, ...) for
 * content shaping / page slugs, and overrides:
 *  - `theme`: selects `JsonTheme` (registered by typedoc-plugin-medusa-theme)
 *  - `entryDocument`: the JSON index document name
 *  - `out`: the canonical `references` directory (now holding `page.json`)
 */
const mergerJsonOptions: Partial<TypeDocOptions> = {
  ...mergerOptions,
  theme: "json",
  entryDocument: "_index.json",
  out: path.join(rootPathPrefix, "www", "apps", "resources", "references"),
}

export default mergerJsonOptions
