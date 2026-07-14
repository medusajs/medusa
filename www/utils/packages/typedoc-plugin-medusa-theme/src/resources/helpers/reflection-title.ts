import Handlebars from "handlebars"
import { PageEvent, ParameterReflection, ReflectionKind } from "typedoc"
import { MarkdownTheme } from "../../theme.js"
import { getDisplayName } from "../../utils.js"
import { escapeChars } from "utils"
import { replaceTemplateVariables } from "../../utils/reflection-template-strings.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "reflectionTitle",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function (this: PageEvent<any>, shouldEscape = true) {
      const { reflectionTitle } = theme.getFormattingOptionsForLocation()

      if (reflectionTitle?.fullReplacement?.length) {
        return theme.reflection
          ? replaceTemplateVariables(
              theme.reflection,
              reflectionTitle.fullReplacement
            )
          : reflectionTitle.fullReplacement
      }

      const title: string[] = [reflectionTitle?.prefix || ""]

      if (
        reflectionTitle?.kind &&
        this.model?.kind &&
        this.url !== this.project.url
      ) {
        title.push(`${ReflectionKind.singularString(this.model.kind)}: `)
      }
      if (this.url === this.project.url) {
        title.push(theme.indexTitle || getDisplayName(this.model))
      } else {
        title.push(
          shouldEscape ? escapeChars(this.model.name) : this.model.name
        )
        if (reflectionTitle?.typeParameters && this.model.typeParameters) {
          const typeParameters = this.model.typeParameters
            .map((typeParameter: ParameterReflection) => typeParameter.name)
            .join(", ")
          title.push(`\`<${typeParameters}>\``)
        }
      }
      if (reflectionTitle?.suffix) {
        title.push(` ${reflectionTitle.suffix}`)
      }
      return title.join("")
    }
  )
}
