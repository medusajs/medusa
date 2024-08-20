import React from "react"
import { Card } from "docs-ui"
import { basePathUrl } from "../lib/base-path-url"

export const FigmaCard = () => {
  return (
    <Card
      title="Medusa UI"
      text="Colors, type, icons and components"
      href="https://www.figma.com/community/file/1278648465968635936/Medusa-UI"
      image={basePathUrl("/images/figma.png")}
      iconClassName="!p-0"
    />
  )
}
