import { Image } from "@theme-ui/components"
import React from "react"

import Logo from "../../assets/github.svg"

const GitHub = () => {
  return (
    <Image
      src={Logo}
      sx={{
        height: "20px",
        fill: "#000",
      }}
    />
  )
}

export default GitHub
