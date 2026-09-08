import Handlebars from "handlebars"
import { Reflection, SignatureReflection } from "typedoc"
import { isWorkflow, isWorkflowStep } from "utils"

export default function () {
  Handlebars.registerHelper("example", function (reflection: Reflection) {
    const isWorkflowOrStep =
      reflection.variant === "signature" &&
      (isWorkflowStep(reflection as SignatureReflection) ||
        isWorkflow(reflection as SignatureReflection))
    const targetReflection =
      isWorkflowOrStep && reflection.parent ? reflection.parent : reflection
    const exampleTag = targetReflection.comment?.blockTags.find(
      (tag) => tag.tag === "@example"
    )

    if (!exampleTag) {
      return ""
    }

    return Handlebars.helpers.commentTag(exampleTag, targetReflection)
  })
}
