import path from "path"
import { fileURLToPath } from "url"

export default function dirname(fileUrl: string) {
  const __filename = fileURLToPath(fileUrl)

  return path.dirname(__filename)
}
