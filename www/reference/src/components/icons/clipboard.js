import { Image } from "@theme-ui/components"
import Logo from "../../assets/clipboard.svg"
import React from "react"

const Clipboard = () => {
  return (
    <Image
      src={Logo}
      sx={{
        height: "100%",
        fill: "light",
        cursor: 'pointer'
      }}
    />
  )
}

export default Clipboard
