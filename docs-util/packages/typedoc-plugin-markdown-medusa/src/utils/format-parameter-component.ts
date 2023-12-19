import { Parameter } from "../types"

type FormatParameterComponentProps = {
  parameterComponent: string | undefined
  componentItems: Parameter[]
  extraProps?: Record<string, unknown>
}

export function formatParameterComponent({
  parameterComponent,
  componentItems,
  extraProps,
}: FormatParameterComponentProps): string {
  let extraPropsArr: string[] = []
  if (extraProps) {
    extraPropsArr = Object.entries(extraProps).map(
      ([key, value]) => `${key}=${JSON.stringify(value)}`
    )
  }
  return `<${parameterComponent} parameters={${JSON.stringify(
    componentItems,
    null,
    2
  )}} ${extraPropsArr.join(" ")}/>`
}
