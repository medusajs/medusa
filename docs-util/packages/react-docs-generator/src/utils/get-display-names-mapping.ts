const DISPLAY_NAME_REGEX =
  /(?<varName>.+)\.displayName\s+=\s+"(?<displayName>.+)"/g

export default function (content: string): Map<string, string> {
  const mappedDisplayNames = new Map<string, string>()

  const displayNameMatches = content.matchAll(DISPLAY_NAME_REGEX)

  for (const match of displayNameMatches) {
    if (match.groups?.varName && match.groups?.displayName) {
      mappedDisplayNames.set(match.groups.displayName, match.groups.varName)
    }
  }

  return mappedDisplayNames
}
