import React, { useState, useEffect } from "react"
import styled from "@emotion/styled"
import { Flex, Box, Text, Image } from "rebass"

const StyledRoutesOverview = styled(Flex)`
  border: 1px solid #e3e8ee;
  border-radius: 5px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-height: calc(90vh - 20px);
  overflow-y: scroll;
  align-self: flex-start;
  font-size: 1;
  top: 20px;
  bottom: 20px;
`

const RoutesOverview = ({ content }) => {
  if (!content) return null

  return (
    <StyledRoutesOverview mb={3} flexDirection="column">
      <Text
        fontSize={0}
        fontFamily="body"
        py={2}
        px={3}
        color="#4f566b"
        backgroundColor="#e3e8ee"
      >
        ENDPOINTS
      </Text>
      <Box
        w={1}
        px={4}
        py={2}
        flex="1"
        sx={{ overflowY: "scroll" }}
        backgroundColor="#f7fafc"
      >
        <Flex fontSize={1} flexDirection="column">
          {content.map(route => (
            <Flex mb={2} width="100%">
              <Text
                width="55px"
                mr={2}
                variant={`labels.${route.method}`}
                textAlign="right"
              >
                {route.method}
              </Text>
              <Text color="#4f566b">
                {route.path.replaceAll(/{(.*?)}/g, ":$1")}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>
    </StyledRoutesOverview>
  )
}

export default RoutesOverview
