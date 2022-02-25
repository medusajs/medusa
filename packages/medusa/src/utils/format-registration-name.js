import path from "path"

/**
 * Formats a filename into the correct container resolution name.
 * Names are camelCase formatted and namespaced by the folder i.e:
 * models/example-person -> examplePersonModel
 * @param {string} fn - the full path of the file
 * @return {string} the formatted name
 */
function formatRegistrationName(fn) {
  const parsed = path.parse(fn)
  const parsedDir = path.parse(parsed.dir)

  const rawname = parsed.name
  let namespace = parsedDir.name
  if (namespace.startsWith("__")) {
    const parsedCoreDir = path.parse(parsedDir.dir)
    namespace = parsedCoreDir.name
  }

  switch (namespace) {
    // We strip the last character when adding the type of registration
    // this is a trick for plural "ies"
    case "repositories":
      namespace = "repositorys"
      break
    case "strategies":
      namespace = "strategys"
      break
    default:
      break
  }

  const upperNamespace =
    namespace.charAt(0).toUpperCase() + namespace.slice(1, -1)

  const parts = rawname.split("-").map((n, index) => {
    if (index !== 0) {
      return n.charAt(0).toUpperCase() + n.slice(1)
    }
    return n
  })

  return parts.join("") + upperNamespace
}

export default formatRegistrationName
