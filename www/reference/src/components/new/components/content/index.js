import styled from "@emotion/styled"
import React from "react"
import { Flex, Box } from "rebass"
import Section from "./section"
import { Link } from "gatsby"

const StyledFlex = styled(Flex)``
const TopBar = styled(Flex)`
  justify-content: flex-end;
`

const Content = ({ data }) => {
  return (
    <StyledFlex flexDirection="column">
      <TopBar fontSize={1} px={5} pt={4}>
        <Box>
          <Link to={"/docs"}>Docs</Link>
        </Box>
        <Box mx={3}>
          <Link to={"/docs"}>Support</Link>
        </Box>
        <Box>
          <Link to={"/sign_in"}>Sign in</Link>
        </Box>
      </TopBar>
      {data.admin.sections.map((s, i) => {
        return <Section key={i} data={s} />
      })}
    </StyledFlex>
  )
}

export default Content
