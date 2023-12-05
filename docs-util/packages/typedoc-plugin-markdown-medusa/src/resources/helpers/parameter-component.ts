import * as Handlebars from "handlebars"
import { ReflectionParameterType } from "../../types"
import { parseParams } from "../../utils/params-utils"
import { MarkdownTheme } from "../../theme"
import { reflectionComponentFormatter } from "../../utils/reflection-formatter"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "parameterComponent",
    function (this: ReflectionParameterType[]) {
      const { parameterComponent, maxLevel, parameterComponentExtraProps } =
        theme.getFormattingOptionsForLocation()
      const parameters = this.reduce(
        (acc: ReflectionParameterType[], current) => parseParams(current, acc),
        []
      ).map((parameter) =>
        reflectionComponentFormatter({
          reflection: parameter,
          level: 1,
          maxLevel,
        })
      )

      let extraProps: string[] = []

      if (parameterComponentExtraProps) {
        extraProps = Object.entries(parameterComponentExtraProps).map(
          ([key, value]) => `${key}=${JSON.stringify(value)}`
        )
      }

      return `<${parameterComponent} parameters={${JSON.stringify(
        parameters,
        null,
        2
      )}} ${extraProps.join(" ")}/>`
    }
  )
}
