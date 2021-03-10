import React from "react"
import { Flex, Box, Text } from "rebass"

import ParamSection from "./param-section"

const Parameters = ({ endpoint }) => {
  const aggregated = endpoint.parameters || []

  const reqBody = endpoint.requestBody || {}
  const props = reqBody.content?.["application/json"]?.schema?.properties
  if (props) {
    for (const [name, details] of Object.entries(props)) {
      if (!aggregated.find(a => a.name === name)) {
        aggregated.push({
          name,
          ...details,
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
        <ParamSection param={p} />
      ))}
    </Box>
  )
}

export default Parameters
