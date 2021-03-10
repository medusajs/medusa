import React from "react"
import { Box, Text } from "rebass"

import ParamSection from "./param-section"

import { deref } from "../utils/deref"

const Parameters = ({ endpoint, spec }) => {
  const aggregated = endpoint.parameters || []

  const reqBody = endpoint.requestBody || {}
  const props = reqBody.content?.["application/json"]?.schema?.properties
  if (props) {
    for (const [name, details] of Object.entries(props)) {
      let cleanDets = details
      if (name === "$ref") {
        const [, ...path] = details.split("/")
        cleanDets = deref(path, spec)
      }

      if (!aggregated.find(a => a.name === name)) {
        aggregated.push({
          name,
          ...cleanDets,
        })
      }
    }
  }

  if (!aggregated.length) {
    return null
  }

  return (
    <Box
      sx={{
        borderBottom: "hairline",
      }}
      my="2"
    >
      <Text my={2}>Parameters</Text>
      {aggregated.map(p => (
        <ParamSection param={p} spec={spec} />
      ))}
    </Box>
  )
}

export default Parameters
