import React from "react"
import { Flex, Heading } from "rebass"
import { Link } from "gatsby"

const Intro = ({ title, desc }) => {
  return (
    <Flex flexDirection="column" sx={{ marginBottom: 80 }}>
      <Heading>Documentation</Heading>
      <p>{title}</p>
      <Heading>Quickstart</Heading>
      <p>{desc}</p>
      <Link to="/intro">Get started now</Link>
    </Flex>
  )
}

export default Intro
