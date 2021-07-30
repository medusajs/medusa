import React from "react"
import { Flex } from "theme-ui"
import Section from "./section"

const Content = ({ data }) => {
  return (
    <Flex
      sx={{
        flexDirection: "column",
      }}
    >
      {data.sections.map((s, i) => {
        return <Section key={i} data={s} />
      })}
    </Flex>
  )
}

export default Content
