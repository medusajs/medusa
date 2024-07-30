import * as Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"
import { isWorkflowStep } from "../../utils/step-utils"

export default function () {
  Handlebars.registerHelper(
    "ifWorkflowStep",
    function (this: SignatureReflection, options: Handlebars.HelperOptions) {
      return isWorkflowStep(this) ? options.fn(this) : options.inverse(this)
    }
  )
}
