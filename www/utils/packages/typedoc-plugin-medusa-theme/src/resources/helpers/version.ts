import Handlebars from "handlebars"
import { Reflection } from "typedoc"

export default function () {
  Handlebars.registerHelper("version", function (reflection: Reflection) {
    const sinceTag = reflection.comment?.blockTags.find(
      (tag) => tag.tag === "@since"
    )

    if (!sinceTag) {
      return ""
    }

    const tagContent = sinceTag.content.map((content) => content.text).join("")

    return `:::note\n\nThis is available starting from [Medusa v${tagContent}](https://github.com/medusajs/medusa/releases/tag/v${tagContent}).\n\n:::`
  })
}
