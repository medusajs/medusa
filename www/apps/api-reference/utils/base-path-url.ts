import { getLinkWithBasePath } from "docs-ui"

export default function basePathUrl(path: string) {
  return getLinkWithBasePath(path, process.env.NEXT_PUBLIC_BASE_PATH)
}
