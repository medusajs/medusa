import * as Handlebars from "handlebars"
import { Comment } from "typedoc"

export default function () {
  Handlebars.registerHelper(
    "featureFlag",
    function (comment: Comment | undefined) {
      if (!comment) {
        return undefined
      }
      const featureFlagTag = comment.getTag("@featureFlag")
      if (!featureFlagTag) {
        return undefined
      }

      return featureFlagTag.content
        .map((tagContent) => tagContent.text)
        .join("")
    }
  )
}
