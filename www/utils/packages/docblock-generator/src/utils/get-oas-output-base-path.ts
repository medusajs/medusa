import path from "path"
import getMonorepoRoot from "./get-monorepo-root.js"

export default function getOasOutputBasePath() {
  return path.join(getMonorepoRoot(), "www", "utils", "generated", "oas-output")
}
