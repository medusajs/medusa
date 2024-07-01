import * as fs from "fs"
import * as Handlebars from "handlebars"
import { CommentDisplayPart } from "typedoc/dist/lib/models/comments/comment"
import { escapeChars } from "utils"

export default function () {
  Handlebars.registerHelper("comment", function (parts: CommentDisplayPart[]) {
    const result: string[] = []
    for (const part of parts) {
      switch (part.kind) {
        case "text":
          result.push(escapeChars(part.text, false))
          break
        case "code":
          result.push(part.text)
          break
        case "inline-tag":
          switch (part.tag) {
            case "@label":
            case "@inheritdoc":
              break
            case "@schema":
            case "@link":
            case "@linkcode":
            case "@linkplain": {
              if (part.target) {
                const url =
                  typeof part.target === "string"
                    ? part.target
                    : "url" in part.target
                      ? Handlebars.helpers.relativeURL(part.target.url)
                      : ""
                const wrap = part.tag === "@linkcode" ? "`" : ""
                result.push(
                  url ? `[${wrap}${part.text}${wrap}](${url})` : part.text
                )
              } else {
                result.push(part.text)
              }
              break
            }
            default:
              result.push(`{${part.tag} ${part.text}}`)
              break
          }
          break
        default:
          result.push("")
      }
    }

    return result.join("")
  })
}

/**
 * Load the given file and return its contents.
 *
 * @param file  The path of the file to read.
 * @returns The files contents.
 */
export function readFile(file: string): string {
  const buffer = fs.readFileSync(file)
  switch (buffer[0]) {
    case 0xfe:
      if (buffer[1] === 0xff) {
        let i = 0
        while (i + 1 < buffer.length) {
          const temp = buffer[i]
          buffer[i] = buffer[i + 1]
          buffer[i + 1] = temp
          i += 2
        }
        return buffer.toString("ucs2", 2)
      }
      break
    case 0xff:
      if (buffer[1] === 0xfe) {
        return buffer.toString("ucs2", 2)
      }
      break
    case 0xef:
      if (buffer[1] === 0xbb) {
        return buffer.toString("utf8", 3)
      }
  }

  return buffer.toString("utf8", 0)
}
