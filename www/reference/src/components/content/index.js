import React from "react"
import { Flex } from "theme-ui"
import Topbar from "../topbar"
import Section from "./section"

const Content = ({ data }) => {
  return (
    <Flex
      sx={{
        flexDirection: "column",
      }}
    >
      <Topbar />
      {data.sections.map((s, i) => {
        return <Section key={i} data={s} />
      })}
    </Flex>
  )
}

export default Content
