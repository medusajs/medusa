import path from "path"
import dirname from "./dirname.js"

export default function getMonorepoRoot() {
  return (
    process.env.MONOREPO_ROOT_PATH ||
    path.join(dirname(), "..", "..", "..", "..", "..")
  )
}
