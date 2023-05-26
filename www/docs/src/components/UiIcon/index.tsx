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
      className="tw-align-sub tw-w-[20px] tw-h-[20px]"
    />
  )
}

export default UiIcon
