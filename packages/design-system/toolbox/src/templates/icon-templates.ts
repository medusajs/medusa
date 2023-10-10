export const defaultTemplate = (
  { jsx, componentName }: { jsx: any; componentName: string },
  { tpl }: { tpl: any }
) => {
  return tpl`
  import * as React from "react"

  import type { IconProps } from "../types"

  const ${componentName} = React.forwardRef<SVGSVGElement, IconProps>(({ color = "currentColor", ...props }, ref) => {
    return (
      ${jsx}
    )
  })
  ${componentName}.displayName = "${componentName}"

  export default ${componentName}
  `
}

export const fixedTemplate = (
  { jsx, componentName }: { jsx: any; componentName: string },
  { tpl }: { tpl: any }
) => {
  return tpl`
  import * as React from "react"

  import type { IconProps } from "../types"

  const ${componentName} = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>((props, ref) => {
    return (
      ${jsx}
    )
  })
  ${componentName}.displayName = "${componentName}"

  export default ${componentName}
  `
}
