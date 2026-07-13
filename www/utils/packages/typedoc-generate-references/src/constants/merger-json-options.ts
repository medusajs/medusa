import { TypeDocOptions } from "typedoc"
import path from "path"
import { rootPathPrefix } from "./general.js"
import mergerOptions from "./merger-options.js"

/**
 * Merge-phase options that emit the references doc-model (`DocPage` JSON) via
 * the `json` theme instead of MDX.
 *
 * It reuses every setting from {@link mergerOptions} (entry points, the
 * regex-keyed `formatting` map, `allowedProjectDocuments`, `maxLevel`, ...) so
 * page slugs and content shaping stay identical to the MDX pipeline, and only
 * overrides:
 *  - `theme`: selects `JsonTheme` (registered by typedoc-plugin-markdown-medusa)
 *  - `out`: a parallel `references-json` directory so both artifacts can be
 *    produced side by side during the incremental migration
 *  - `entryDocument`: the JSON index document name
 */
const mergerJsonOptions: Partial<TypeDocOptions> = {
  ...mergerOptions,
  theme: "json",
  entryDocument: "_index.json",
  out: path.join(
    rootPathPrefix,
    "www",
    "apps",
    "resources",
    "references-json"
  ),
}

export default mergerJsonOptions
