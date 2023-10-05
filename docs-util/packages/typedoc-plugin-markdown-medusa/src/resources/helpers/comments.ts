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
      commentLevel = 4
    ) {
      const { showCommentsAsHeader } = theme.getFormattingOptionsForLocation()
      const md: string[] = []

      if (showSummary && comment.summary) {
        md.push(Handlebars.helpers.comment(comment.summary))
      }

      const filteredTags = comment.blockTags.filter(
        (tag) => tag.tag !== "@returns"
      )

      if (showTags && comment.blockTags?.length) {
        const tags = filteredTags.map((tag) => {
          return `${
            showCommentsAsHeader
              ? `${Handlebars.helpers.titleLevel(commentLevel)} `
              : "**`"
          }${camelToTitleCase(tag.tag.substring(1))}${
            showCommentsAsHeader ? "" : "`**"
          }\n\n${Handlebars.helpers.comment(tag.content)}`
        })
        md.push(tags.join("\n\n"))
      }

      return md.join("\n\n")
    }
  )
}
