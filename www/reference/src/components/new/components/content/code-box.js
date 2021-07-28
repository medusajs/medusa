import React from "react"
import { Flex, Box, Text } from "rebass"
import styled from "@emotion/styled"
import typography from "../../../typography"
import { css } from "@emotion/react"

const Sticky = css`
  position: sticky;
  top: 20px;
`

const Container = styled(Box)`
  background: var(--faded);
  border-radius: var(--border-radius-8);
  box-shadow: 0 0 0 1px rgb(0 0 0 / 7%);
  align-self: flex-end;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  position: ${props => (props.sticky ? "sticky" : "relative")};
  top: ${props => (props.sticky ? "20px" : "")};
`

const Header = styled(Box)`
  background: var(--dark);
  color: var(--light);
  ${typography.Small}
  font-weight: 500;
  padding: 10px 12px;
  letter-spacing: 0.01em;
  border-radius: var(--border-radius-8) var(--border-radius-8) 0 0;
`

const CodeBlock = styled(Box)`
  position: relative;
  box-sizing: content-box;
  max-height: calc(90vh - 20px);
  min-height: 90px;
`

const CodeBlockScroll = styled(Flex)`
  flex-direction: column;
  position: relative;
  min-height: inherit;
  max-height: inherit;
  overflow-y: auto;
`
const CodeBox = ({ header, sticky = true, children }) => {
  return (
    <Container sticky={sticky} mb={4}>
      <Header>
        <Text>{header}</Text>
      </Header>
      <CodeBlock>
        <CodeBlockScroll>{children}</CodeBlockScroll>
      </CodeBlock>
    </Container>
  )
}

export default CodeBox
