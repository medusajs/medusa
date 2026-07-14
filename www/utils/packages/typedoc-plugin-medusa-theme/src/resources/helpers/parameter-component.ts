import Handlebars from "handlebars"
import { ReflectionParameterType } from "../../types.js"
import { parseParams } from "../../utils/params-utils.js"
import { MarkdownTheme } from "../../theme.js"
import { reflectionComponentFormatter } from "../../utils/reflection-formatter.js"
import { formatParameterComponent } from "../../utils/format-parameter-component.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "parameterComponent",
    function (
      this: ReflectionParameterType[],
      options: Handlebars.HelperOptions,
      extraProps?: Record<string, unknown>
    ) {
      const { parameterComponent, maxLevel, parameterComponentExtraProps } =
        theme.getFormattingOptionsForLocation()
      const parameters = this.reduce(
        (acc: ReflectionParameterType[], current) => parseParams(current, acc),
        []
      )
        .filter((parameter) => {
          // remove parameters that are supposed to be nested
          return !parameter.name.includes(".")
        })
        .map((parameter) =>
          reflectionComponentFormatter({
            reflection: parameter,
            level: 1,
            maxLevel,
            project: theme.project,
          })
        )

      return formatParameterComponent({
        parameterComponent,
        componentItems: parameters,
        extraProps: {
          ...parameterComponentExtraProps,
          ...extraProps,
        },
        sectionTitle: options.hash.sectionTitle,
      })
    }
  )
}
