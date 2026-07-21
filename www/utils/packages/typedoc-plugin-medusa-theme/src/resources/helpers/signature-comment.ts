import Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"

export default function () {
  Handlebars.registerHelper(
    "signatureComment",
    function (this: SignatureReflection) {
      if (!this.comment && !this.parent.comment) {
        return ""
      }
      return Handlebars.helpers.comments(this.comment || this.parent.comment)
    }
  )
}
