import { BorderedIcon } from "docs-ui"
import { Figma } from "./icons"

export const FigmaIcon = () => {
  return (
    <BorderedIcon
      IconComponent={Figma}
      iconWrapperClassName={
        "bg-medusa-button-inverted bg-button-inverted !p-[6px]"
      }
    />
  )
}
