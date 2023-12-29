import * as fs from "fs"
import * as Handlebars from "handlebars"
import * as Path from "path"
import { CommentDisplayPart } from "typedoc/dist/lib/models/comments/comment"
import { MarkdownTheme } from "../../theme"
import { escapeChars } from "utils"

export default function (theme: MarkdownTheme) {
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

    return parseMarkdown(result.join(""), theme)
  })
}

function parseMarkdown(text: string, theme: MarkdownTheme) {
  const includePattern = /\[\[include:([^\]]+?)\]\]/g
  const mediaPattern = /media:\/\/([^ ")\]}]+)/g

  if (theme.includes) {
    text = text.replace(includePattern, (_match, path) => {
      path = Path.join(theme.includes!, path.trim())
      if (fs.existsSync(path) && fs.statSync(path).isFile()) {
        const contents = readFile(path)
        return contents
      } else {
        theme.application.logger.warn("Could not find file to include: " + path)
        return ""
      }
    })
  }

  if (theme.mediaDirectory) {
    text = text.replace(mediaPattern, (match: string, path: string) => {
      const fileName = Path.join(theme.mediaDirectory!, path)

      if (fs.existsSync(fileName) && fs.statSync(fileName).isFile()) {
        return Handlebars.helpers.relativeURL("media") + "/" + path
      } else {
        theme.application.logger.warn("Could not find media file: " + fileName)
        return match
      }
    })
  }

  return text
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
