import * as Handlebars from "handlebars"
import { Comment } from "typedoc"
import { camelToTitleCase } from "../../utils"
import { MarkdownTheme } from "../../theme"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "comments",
    function (
      comment: Comment,
      showSummary = true,
      showTags = true,
      commentLevel = 4,
      parent = null
    ) {
      const { showCommentsAsHeader, showCommentsAsDetails } =
        theme.getFormattingOptionsForLocation()
      const md: string[] = []

      if (showSummary && comment.summary) {
        md.push(Handlebars.helpers.comment(comment.summary))
      }

      const filteredTags = comment.blockTags.filter(
        (tag) => tag.tag !== "@returns"
      )

      if (showTags && comment.blockTags?.length) {
        const tags = filteredTags.map((tag) => {
          const tagTitle = camelToTitleCase(tag.tag.substring(1)),
            tagContent = Handlebars.helpers.comment(tag.content)

          if (showCommentsAsHeader) {
            return `${Handlebars.helpers.titleLevel.call(
              parent || comment,
              commentLevel
            )} ${tagTitle}\n\n${tagContent}`
          } else if (showCommentsAsDetails) {
            return `<details>\n<summary>\n${tagTitle}\n</summary>\n\n${tagContent}\n\n</details>`
          } else {
            return `**${tagTitle}**\n\n${tagContent}`
          }
        })
        md.push(tags.join("\n\n"))
      }

      return md.join("\n\n")
    }
  )
}
