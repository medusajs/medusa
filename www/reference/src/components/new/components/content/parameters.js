import React from "react"
import { Flex, Text, Box } from "rebass"
import Markdown from "react-markdown"
import Collapsible from "react-collapsible"
import styled from "@emotion/styled"

const MarkdownText = styled(Text)`
  & code {
    background-color: #e3e8ee;
    border-radius: 5px;
    padding: 4px;
  }
`

const NestedParameters = ({ params }) => {
  return (
    <Collapsible trigger="Show nested parameters">
      <Box></Box>
    </Collapsible>
  )
}

const Parameters = ({ params }) => {
  return (
    <Flex flexDirection="column" mt={4}>
      <Text
        pb="12px"
        sx={{
          borderBottom: "hairline",
        }}
      >
        Parameters
      </Text>
      {params.properties.length > 0 ? (
        params.properties.map((prop, i) => {
          return (
            <Box
              py={2}
              sx={{
                borderBottom: "hairline",
              }}
              fontFamily="monospace"
              key={i}
            >
              <Flex alignItems="baseline">
                <Text mr={2} fontSize={"12px"}>
                  {prop.property}
                </Text>
                <Text color={"gray"} fontSize={"10px"}>
                  {prop.type}
                </Text>
                {params.required && params.required.includes(prop.property) && (
                  <Text ml={1} fontSize={"10px"} variant="labels.required">
                    required
                  </Text>
                )}
              </Flex>
              <MarkdownText fontSize={0}>
                <Markdown>{prop.description}</Markdown>
              </MarkdownText>
              {prop.items.properties && (
                <>
                  <Collapsible trigger="Show nested parameters">
                    {prop.items.properties.map((nested, i) => {
                      return <div key={i}>{nested.property}</div>
                    })}
                  </Collapsible>
                </>
              )}
            </Box>
          )
        })
      ) : (
        <Text
          fontSize="12px"
          py={3}
          fontFamily="monospace"
          sx={{ borderBottom: "hairline" }}
        >
          No parameters
        </Text>
      )}
    </Flex>
  )
}

export default Parameters
