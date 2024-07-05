import path from "path"
import { fileURLToPath } from "url"

export default function dirname() {
  const __filename = fileURLToPath(import.meta.url)

  return path.dirname(__filename)
}
