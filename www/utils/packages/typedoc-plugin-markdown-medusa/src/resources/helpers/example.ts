import * as Handlebars from "handlebars"
import { Reflection, SignatureReflection } from "typedoc"
import { isWorkflowStep } from "../../utils/step-utils"

export default function () {
  Handlebars.registerHelper("example", function (reflection: Reflection) {
    const isStep =
      reflection.variant === "signature" &&
      isWorkflowStep(reflection as SignatureReflection)
    const targetReflection =
      isStep && reflection.parent ? reflection.parent : reflection
    const exampleTag = targetReflection.comment?.blockTags.find(
      (tag) => tag.tag === "@example"
    )

    if (!exampleTag) {
      return ""
    }

    return Handlebars.helpers.commentTag(exampleTag, targetReflection)
  })
}
