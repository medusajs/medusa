import slugify from "slugify"

export default function getSectionId(path: string[]) {
  path = path.map((p) => slugify(p.trim().toLowerCase()))
  return path.join("_")
}
