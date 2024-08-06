import { MarkdownTheme } from "../../theme"
import * as Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"
import { getWorkflowInputType } from "utils"
import { formatParameterComponent } from "../../utils/format-parameter-component"
import { getReflectionTypeParameters } from "../../utils/reflection-type-parameters"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "workflowInput",
    function (
      this: SignatureReflection,
      options: Handlebars.HelperOptions
    ): string {
      const { parameterComponent, maxLevel, parameterComponentExtraProps } =
        theme.getFormattingOptionsForLocation()

      const inputType = getWorkflowInputType(this)
      if (!inputType) {
        return ""
      }

      const input = getReflectionTypeParameters({
        reflectionType: inputType,
        project: this.project || options.data.theme.project,
        maxLevel,
      })

      if (!input.length) {
        return ""
      }

      const formattedComponent = formatParameterComponent({
        parameterComponent,
        componentItems: input,
        extraProps: parameterComponentExtraProps,
        sectionTitle: options.hash.sectionTitle,
      })

      return `${Handlebars.helpers.titleLevel()} Input\n\n${formattedComponent}`
    }
  )
}
