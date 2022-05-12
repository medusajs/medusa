import { Image } from "@theme-ui/components"
import Logo from "../../assets/github.svg"
import LogoLight from "../../assets/github-light.svg"
import React from "react"
import { useColorMode } from 'theme-ui'

const GitHub = () => {
  const [colorMode,] = useColorMode()

  return (
    <Image
      src={colorMode === 'light' ? Logo : LogoLight}
      sx={{
        height: "24px",
      }}
    />
  )
}

export default GitHub
