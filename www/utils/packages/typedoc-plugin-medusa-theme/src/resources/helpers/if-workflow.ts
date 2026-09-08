import Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"
import { isWorkflow } from "utils"

export default function () {
  Handlebars.registerHelper(
    "ifWorkflow",
    function (this: SignatureReflection, options: Handlebars.HelperOptions) {
      return isWorkflow(this) ? options.fn(this) : options.inverse(this)
    }
  )
}
