import React from "react"
import { Flex, Box } from "rebass"

const Layout = ({ children }) => {
  return (
    <Flex
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: "scroll",
      }}
      fontFamily={"body"}
      flexDirection="column"
      flexGrow="1"
    >
      <Box>{children}</Box>
    </Flex>
  )
}

export default Layout
