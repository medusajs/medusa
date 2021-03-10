import React, { useState, useEffect } from "react"
import { graphql } from "gatsby"
import { Flex, Box, Text, Image } from "rebass"
import styled from "@emotion/styled"
import { AnchorLink } from "gatsby-plugin-anchor-links"
import Markdown from "react-markdown"
import Highlight from "react-highlight.js"

import "highlight.js/styles/a11y-light.css"

import fixtures from "../../../docs/api/fixtures.json"

export const ResponseContainer = styled(Flex)`
  border: 1px solid #e3e8ee;
  border-radius: 5px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-height: calc(90vh - 20px);
  overflow-y: scroll;
  align-self: flex-start;
  font-size: 1;
  position: sticky;
  top: 20px;

  code {
    background: #f7fafc !important;
  }
`

const JsonBox = ({ text, resourceId, endpoint }) => {
  const [json, setJson] = useState({})

  useEffect(() => {
    const toSet = {}
    if (endpoint) {
      const props =
        endpoint?.responses?.["200"]?.content?.["application/json"]?.schema
          ?.properties

      if (props) {
        for (const [name, details] of Object.entries(props)) {
          if (
            details["x-resourceId"] &&
            details["x-resourceId"] in fixtures.resources
          ) {
            toSet[name] = fixtures.resources[details["x-resourceId"]]
          } else {
            toSet[name] = details
          }
        }
      }
    }

    if (resourceId) {
      setJson(fixtures.resources[resourceId])
    } else {
      setJson(toSet)
    }
  }, [])

  return (
    <ResponseContainer flexDirection="column" as="pre">
      <Text
        fontSize={0}
        fontFamily="body"
        py={2}
        px={3}
        color="#4f566b"
        backgroundColor="#e3e8ee"
      >
        {text || "RESPONSE"}
      </Text>
      <Box
        w={1}
        flex="1"
        sx={{ overflowY: "scroll" }}
        backgroundColor="#f7fafc"
      >
        <Highlight language="json">
          {JSON.stringify(json, undefined, 2)}
        </Highlight>
      </Box>
    </ResponseContainer>
  )
}

export default JsonBox
