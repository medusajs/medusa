// The version config lives in `docs-utils` so that non-React consumers (the
// Markdown/LLM generation pipeline, build scripts) can read it too. It's
// imported from the `global-config` subpath to keep the rest of `docs-utils`
// out of the client bundle.
export { globalConfig } from "docs-utils/global-config"
