import { parse } from "path"
import { toCamelCase, upperCaseFirst } from "@medusajs/utils"

/**
 * Formats a filename into the correct container resolution name.
 * Names are camelCase formatted and namespaced by the folder i.e:
 * models/example-person -> examplePersonModel
 * @param path - the full path of the file
 * @return the formatted name
 */
export function formatRegistrationName(path: string): string {
  const parsed = parse(path)
  const parsedDir = parse(parsed.dir)
  let directoryNamespace = parsedDir.name

  if (directoryNamespace.startsWith("__")) {
    const parsedCoreDir = parse(parsedDir.dir)
    directoryNamespace = parsedCoreDir.name
  }

  switch (directoryNamespace) {
    // We strip the last character when adding the type of registration
    // this is a trick for plural "ies"
    case "repositories":
      directoryNamespace = "repositorys"
      break
    case "strategies":
      directoryNamespace = "strategys"
      break
    default:
      break
  }

  const upperNamespace = upperCaseFirst(directoryNamespace.slice(0, -1))

  return formatRegistrationNameWithoutNamespace(path) + upperNamespace
}

export function formatRegistrationNameWithoutNamespace(path: string): string {
  const parsed = parse(path)

  return toCamelCase(parsed.name)
}

export default formatRegistrationName
