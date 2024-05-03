import path from "path"
import dirname from "../utils/dirname.js"

export const rootPathPrefix = path.join(dirname(), "..", "..", "..", "..", "..")

export const docsUtilPathPrefix = path.join(rootPathPrefix, "docs-util")

export const jsonOutputPathPrefix = path.join(
  docsUtilPathPrefix,
  "typedoc-json-output"
)
