import path from "path"
import getMonorepoRoot from "./get-monorepo-root.js"

export default function getOasOutputBasePath() {
  return path.join(getMonorepoRoot(), "docs-util", "oas-output")
}
