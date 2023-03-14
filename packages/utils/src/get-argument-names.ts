export function getArgumentNamesFromMethod(method) {
  const parseArguments = method.toString().match(/\((.*?)\)/s)[1]
  const argNames: string[] = []

  if (parseArguments) {
    const args = parseArguments.replace(/\{.*?\}/g, "").split(",")

    for (const arg of args) {
      argNames.push(arg.split("=")[0].trim())
    }
  }
  return argNames
}
