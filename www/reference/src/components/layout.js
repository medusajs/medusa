import React from "react"
import { Flex, Box } from "theme-ui"
import Sidebar from "./sidebar"

const Layout = ({ data, api, children }) => {
  return (
    <Flex sx={{ p: "0", m: "0", overflow: "hidden" }}>
      <Flex
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          fontFamily: "body",
          flexGrow: "1",
        }}
      >
        <Sidebar data={data} api={api} />
        <Box>{children}</Box>
      </Flex>
    </Flex>
  )
}

export default Layout
