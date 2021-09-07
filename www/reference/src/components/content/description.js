import React from "react"
import { Box } from "theme-ui"

const Description = ({ children }) => {
  return (
    <Box
      sx={{
        code: {
          backgroundColor: "faded",
          borderRadius: "4px",
          p: "3px",
        },
      }}
    >
      {children}
    </Box>
  )
}

export default Description
