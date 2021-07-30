import React from "react"
import { Flex, Box, Text } from "theme-ui"
import styled from "@emotion/styled"

const Container = styled(Box)`
  background: var(--faded-contrast);
  border-radius: var(--border-radius-8);
  box-shadow: 0 0 0 1px rgb(0 0 0 / 7%);
  align-self: flex-start;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  position: ${props => (props.sticky ? "sticky" : "relative")};
  top: ${props => (props.sticky ? "20px" : "")};
`

const CodeBlock = styled(Box)`
  position: relative;
  box-sizing: content-box;
  max-height: calc(90vh - 20px);
  min-height: 10px;
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
      <Box
        sx={{
          bg: "faded",
          p: "8px 10px",
          letterSpacing: "0.01em",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Text variant="small" sx={{ fontWeight: "400" }}>
          {header}
        </Text>
      </Box>
      <CodeBlock>
        <CodeBlockScroll>{children}</CodeBlockScroll>
      </CodeBlock>
    </Container>
  )
}

export default CodeBox
