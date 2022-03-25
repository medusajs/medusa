import { Box, Flex } from "theme-ui"

import React from "react"
import Section from "./section"
import Topbar from "../topbar"

const Content = ({ data, currentSection, api }) => {
  return (
    <Flex
      sx={{
        flexDirection: "column",
      }}
    >
      <Topbar data={data} api={api} />
      <Box
        sx={{
          maxHeight: "calc(100vh - 50px)",
          overflowY: "scroll",
          "@media screen and (max-width: 848px)": {
            mt: "50px",
          },
        }}
      >
        <Section data={currentSection} api={api} />
      </Box>
    </Flex>
  )
}

export default Content
