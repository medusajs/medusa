import { EOL } from "os"

import { Indent } from "../Indent"

export const formatIndentation = (s: string, indent: Indent): string => {
  let lines = s.split(EOL)
  lines = lines.map((line) => {
    switch (indent) {
      case Indent.SPACE_4:
        return line.replace(/\t/g, "    ")
      case Indent.SPACE_2:
        return line.replace(/\t/g, "  ")
      case Indent.TAB:
        return line // Default output is tab formatted
    }
  })
  // Make sure we have a blank line at the end
  const content = lines.join(EOL)
  return `${content}${EOL}`
}
