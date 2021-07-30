import React from "react"
import { Box } from "theme-ui"

const ChevronDown = ({ fill = "darkContrast", styles }) => {
  return (
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   width="16"
    //   height="16"
    //   fill="none"
    //   viewBox="0 0 16 16"
    // >
    //   <path
    //     fillRule="evenodd"
    //     d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
    //     fill={fill}
    //   />
    // </svg>
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
