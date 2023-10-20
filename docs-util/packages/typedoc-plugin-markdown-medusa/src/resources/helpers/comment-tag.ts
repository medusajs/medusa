import * as Handlebars from "handlebars"
import { CommentTag } from "typedoc"
import { camelToTitleCase } from "../../utils"
import { MarkdownTheme } from "../../theme"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "commentTag",
    function (tag: CommentTag, commentLevel = 4, parent = null) {
      const { showCommentsAsHeader, showCommentsAsDetails } =
        theme.getFormattingOptionsForLocation()
      const tagTitle = camelToTitleCase(tag.tag.substring(1)),
        tagContent = Handlebars.helpers.comment(tag.content)

      if (showCommentsAsHeader) {
        return `${Handlebars.helpers.titleLevel.call(
          parent,
          commentLevel
        )} ${tagTitle}\n\n${tagContent}`
      } else if (showCommentsAsDetails) {
        return `<details>\n<summary>\n${tagTitle}\n</summary>\n\n${tagContent}\n\n</details>`
      }

      return `**${tagTitle}**\n\n${tagContent}`
    }
  )
}
