import { normalizePath, VALID_FILE_EXTENSIONS } from "../utils"

export function getRoute(file: string): string {
  const importPath = normalizePath(file)
  return importPath
    .replace(/.*\/admin\/(routes)/, "")
    .replace("[[*]]", "*?")               // optional splat
    .replace("[*]", "*")                  // splat
    .replace(/\(([^\[\]\)]+)\)/g, "$1?")  // optional static,  (foo)
    .replace(/\[\[([^\]]+)\]\]/g, ":$1?") // optional dynamic, [[foo]]
    .replace(/\[([^\]]+)\]/g, ":$1")      // dynamic,          [foo]
    .replace(
      new RegExp(
        `/page\\.(${VALID_FILE_EXTENSIONS.map((ext) => ext.slice(1)).join(
          "|"
        )})$`
      ),
      ""
    )
}
