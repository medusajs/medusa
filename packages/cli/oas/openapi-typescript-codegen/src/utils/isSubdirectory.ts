import { relative } from "path"

export const isSubDirectory = (parent: string, child: string) => {
  return relative(child, parent).startsWith("..")
}
