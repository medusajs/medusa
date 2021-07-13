import React from "react"
import { Flex, Heading } from "rebass"

const Intro = ({ title, desc }) => {
  return (
    <Flex flexDirection="column" sx={{ marginBottom: 80 }}>
      <Heading>Documentation</Heading>
      <p>{title}</p>
      <Heading>Quickstart</Heading>
      <p>{desc}</p>
      <a href="/docs/tutorials/overview">Get started now</a>
    </Flex>
  )
}

export default Intro
