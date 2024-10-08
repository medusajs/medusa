import * as Handlebars from "handlebars"
import {
  ParameterReflection,
  ReflectionKind,
  SignatureReflection,
} from "typedoc"
import { memberSymbol } from "../../utils"
import { MarkdownTheme } from "../../theme"
import { getHTMLChar } from "utils"
import getCorrectDeclarationReflection from "../../utils/get-correct-declaration-reflection"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "signatureTitle",
    function (this: SignatureReflection, accessor?: string, standalone = true) {
      const { sections, expandMembers = false } =
        theme.getFormattingOptionsForLocation()
      this.parent =
        getCorrectDeclarationReflection(this.parent, theme) || this.parent
      const parentHasMoreThanOneSignature =
        Handlebars.helpers.hasMoreThanOneSignature(this.parent)
      if (
        sections &&
        sections.member_signature_title === false &&
        !parentHasMoreThanOneSignature
      ) {
        // only show title if there are more than one signatures
        return ""
      }

      const md: string[] = []

      if (!expandMembers) {
        md.push("`")
      }

      if (standalone && !theme.hideMembersSymbol) {
        md.push(`${memberSymbol(this)} `)
      }

      const parentFlags = this.parent.flags.getFlagStrings(
        theme.application.internationalization
      )
      if (this.parent && parentFlags.length > 0) {
        md.push(parentFlags.join(" ") + " ")
      }

      if (accessor) {
        md.push(
          `${accessor}${
            expandMembers ? `${Handlebars.helpers.titleLevel()} ` : "**"
          }${this.name}${!expandMembers ? "**" : ""}`
        )
      } else if (this.name !== "__call" && this.name !== "__type") {
        md.push(
          `${expandMembers ? `${Handlebars.helpers.titleLevel()} ` : "**"}${
            this.name
          }${!expandMembers ? "**" : ""}`
        )
      }

      if (this.typeParameters) {
        md.push(
          `${expandMembers ? getHTMLChar("<") : "<"}${this.typeParameters.join(
            ", "
          )}${expandMembers ? getHTMLChar(">") : ">"}`
        )
      }
      md.push(`(${getParameters(this.parameters, false)})`)

      if (this.type && !this.parent?.kindOf(ReflectionKind.Constructor)) {
        md.push(
          `: ${Handlebars.helpers.type.call(this.type, "none", !expandMembers)}`
        )
      }

      if (!expandMembers) {
        md.push("`")
      }
      return md.join("") + (standalone ? "\n" : "")
    }
  )
}

const getParameters = (
  parameters: ParameterReflection[] = [],
  backticks = true
) => {
  return parameters
    .map((param) => {
      const isDestructuredParam = param.name == "__namedParameters"
      const paramItem = `${param.flags.isRest ? "..." : ""}${
        isDestructuredParam ? "«destructured»" : param.name
      }${param.flags.isOptional || param.defaultValue ? "?" : ""}`
      return backticks ? `\`${paramItem}\`` : paramItem
    })
    .join(", ")
}
