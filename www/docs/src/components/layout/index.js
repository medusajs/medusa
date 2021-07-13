import React from "react"
import { Flex, Box } from "rebass"

import Header from "../header"

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Flex justifyContent="center" fontFamily={"body"}>
        <Box>{children}</Box>
      </Flex>
    </>
  )
}

export default Layout
