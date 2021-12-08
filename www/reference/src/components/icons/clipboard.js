import { Image } from "@theme-ui/components"
import React from "react"

import Logo from "../../assets/clipboard.svg"

const Clipboard = () => {
  return (
    <Image
      src={Logo}
      sx={{
        height: "100%",
        fill: "#000",
        cursor: 'pointer'
      }}
    />
  )
}

export default Clipboard
