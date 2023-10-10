import { MarkdownTheme } from "../../theme"
import * as Handlebars from "handlebars"
import { SignatureReflection, Reflection } from "typedoc"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "titleLevel",
    function (this: Reflection, originalLevel = 3): string {
      const { expandMembers, sections } =
        theme.getFormattingOptionsForLocation()

      let isSignatureChild = false
      if (
        sections &&
        sections.member_signature_title === false &&
        (this instanceof SignatureReflection || this.variant === "signature")
      ) {
        // only show title if there are more than one signatures
        isSignatureChild =
          this.parent !== undefined &&
          "signatures" in this.parent &&
          (this.parent.signatures as SignatureReflection[]).length > 1
      }

      const level =
        expandMembers && !isSignatureChild ? originalLevel - 1 : originalLevel

      return Array(level).fill("#").join("")
    }
  )
}
