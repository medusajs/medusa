import React from "react"
import { Box, Flex } from "theme-ui"
import Topbar from "../topbar"
import Section from "./section"

const Content = ({ data, api }) => {
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
        {data.sections.map((s, i) => {
          return <Section key={i} data={s} />
        })}
      </Box>
    </Flex>
  )
}

export default Content
