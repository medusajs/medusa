import React from "react"
import { Box } from "theme-ui"

const ChevronDown = ({ fill = "darkContrast", styles }) => {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      sx={{
        ...styles,
        alignSelf: "center",
        pointerEvents: "none",
        fill: `${fill}`,
      }}
    >
      <path d="M7.41 7.84l4.59 4.58 4.59-4.58 1.41 1.41-6 6-6-6z" />
    </Box>
  )
}

export default ChevronDown
