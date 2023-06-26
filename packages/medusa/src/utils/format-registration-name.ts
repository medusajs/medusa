import { parse } from "path"

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
  const rawname = parsed.name
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

  const upperNamespace =
    directoryNamespace.charAt(0).toUpperCase() + directoryNamespace.slice(1, -1)

  return formatRegistrationNameWithoutNamespace(path) + upperNamespace
}

export function formatRegistrationNameWithoutNamespace(path: string): string {
  const parsed = parse(path)
  const rawname = parsed.name

  const parts = rawname.split("-").map((n, index) => {
    if (index !== 0) {
      return n.charAt(0).toUpperCase() + n.slice(1)
    }
    return n
  })

  return parts.join("")
}

export default formatRegistrationName
