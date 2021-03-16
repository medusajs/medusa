import React from "react"
import { Flex, Box, Text } from "rebass"
import styled from "@emotion/styled"
import Highlight from "react-highlight.js"

import "highlight.js/styles/a11y-light.css"

import fixtures from "../../../docs/api/fixtures.json"

import { deref } from "../utils/deref"

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

const JsonBox = ({ text, resourceId, endpoint, spec }) => {
  let json = {}

  const toSet = {}
  if (endpoint) {
    const props =
      endpoint?.responses?.["200"]?.content?.["application/json"]?.schema
        ?.properties

    if (props) {
      for (const [name, details] of Object.entries(props)) {
        let cleanDets = details
        if (details.$ref) {
          const [, ...path] = details.$ref.split("/")
          cleanDets = deref(path, spec)
        }

        if (
          cleanDets["x-resourceId"] &&
          cleanDets["x-resourceId"] in fixtures.resources
        ) {
          toSet[name] = fixtures.resources[cleanDets["x-resourceId"]]
        } else if (cleanDets.type === "array") {
          toSet[name] = cleanDets
          if (cleanDets.items.$ref) {
            const [, ...path] = cleanDets.items.$ref.split("/")
            let cleanObj = deref(path, spec)
            if (
              cleanObj["x-resourceId"] &&
              cleanObj["x-resourceId"] in fixtures.resources
            ) {
              cleanObj = fixtures.resources[cleanObj["x-resourceId"]]
            }
            toSet[name] = [cleanObj]
          }
        }
      }
    }
  }

  if (resourceId) {
    json = fixtures.resources[resourceId]
  } else {
    json = toSet
  }

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
