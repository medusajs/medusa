import React from "react"
import { Flex } from "theme-ui"
import styled from "@emotion/styled"

const Container = styled(Flex)``

const Section = ({ id, name }) => {
  return <Container id={id}>{name}</Container>
}

export default Section
