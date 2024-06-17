import path from "path"
import dirname from "../utils/dirname.js"

export const rootPathPrefix = path.join(
  dirname(),
  "..",
  "..",
  "..",
  "..",
  "..",
  ".."
)

export const docsUtilPathPrefix = path.join(rootPathPrefix, "www", "utils")

export const jsonOutputPathPrefix = path.join(
  docsUtilPathPrefix,
  "generated",
  "typedoc-json-output"
)
