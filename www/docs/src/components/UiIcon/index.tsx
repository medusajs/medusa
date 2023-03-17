import React from "react"
import ThemedImage from "@theme/ThemedImage"

type UiIconProps = {
  lightIcon: string
  darkIcon?: string
  alt?: string
}

const UiIcon: React.FC<UiIconProps> = ({
  lightIcon,
  darkIcon = "",
  alt = "",
}) => {
  return (
    <ThemedImage
      alt={alt}
      sources={{
        light: lightIcon,
        dark: darkIcon || lightIcon,
      }}
      className="ui-icon"
    />
  )
}

export default UiIcon
