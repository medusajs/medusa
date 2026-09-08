import { MarkdownTheme } from "../../theme.js"
import Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"
import { getWorkflowOutputType } from "utils"
import { formatParameterComponent } from "../../utils/format-parameter-component.js"
import { getReflectionTypeParameters } from "../../utils/reflection-type-parameters.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "workflowOutput",
    function (
      this: SignatureReflection,
      options: Handlebars.HelperOptions
    ): string {
      const { parameterComponent, maxLevel, parameterComponentExtraProps } =
        theme.getFormattingOptionsForLocation()

      const outputType = getWorkflowOutputType(this)
      if (!outputType) {
        return ""
      }

      const output = getReflectionTypeParameters({
        reflectionType: outputType,
        project: this.project || options.data.theme.project,
        maxLevel,
        wrapObject: true,
        isReturn: false,
      })

      if (!output.length) {
        return ""
      }

      const formattedComponent = formatParameterComponent({
        parameterComponent,
        componentItems: output,
        extraProps: {
          ...parameterComponentExtraProps,
          openedLevel: 1,
        },
        sectionTitle: options.hash.sectionTitle,
      })

      return `${Handlebars.helpers.titleLevel()} Output\n\n${formattedComponent}`
    }
  )
}
