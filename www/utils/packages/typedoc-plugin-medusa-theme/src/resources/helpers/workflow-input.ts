import { MarkdownTheme } from "../../theme.js"
import Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"
import { getWorkflowInputType } from "utils"
import { formatParameterComponent } from "../../utils/format-parameter-component.js"
import { getReflectionTypeParameters } from "../../utils/reflection-type-parameters.js"

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
        wrapObject: true,
        isReturn: false,
      })

      if (!input.length) {
        return ""
      }

      const formattedComponent = formatParameterComponent({
        parameterComponent,
        componentItems: input,
        extraProps: {
          ...parameterComponentExtraProps,
          openedLevel: 1,
        },
        sectionTitle: options.hash.sectionTitle,
      })

      return `${Handlebars.helpers.titleLevel()} Input\n\n${formattedComponent}`
    }
  )
}
