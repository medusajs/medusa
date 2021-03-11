import React from "react"
import { Flex, Box, Text } from "rebass"

import RoutesOverview from "./routes-overview"
import ParamSection from "./param-section"
import JsonBox from "./json-box"

const EndpointOverview = ({ title, description, routes, spec }) => {
  let schema = {}
  let attrs = []
  let resourceId

  if (spec) {
    const tag = spec.tags.find(t => t.name === title)

    if (tag && tag["x-resourceId"]) {
      resourceId = tag["x-resourceId"]
      schema = spec.components.schemas[tag["x-resourceId"]]

      for (const [name, details] of Object.entries(schema.properties)) {
        if (!attrs.find(a => a.name === name)) {
          attrs.push({
            name,
            ...details,
          })
        }
      }
    }
  }

  return (
    <Flex flexDirection="row" pb={4}>
      <Flex
        flexDirection="column"
        width="55%"
        pr={5}
        sx={{ lineHeight: "26px" }}
      >
        <Text mb={3} fontSize={4}>
          {title}
        </Text>
        <Text mb={4}>{description || schema.description}</Text>
        {attrs.length > 0 && (
          <Box
            sx={{
              borderBottom: "hairline",
            }}
            my="2"
          >
            <Text my={2}>Attributes</Text>
            {attrs.map(p => (
              <ParamSection param={p} spec={spec} />
            ))}
          </Box>
        )}
      </Flex>
      <Flex width={"45%"} flexDirection="column">
        {routes && <RoutesOverview content={routes} />}
        {resourceId && <JsonBox text={"OBJECT"} resourceId={resourceId} />}
      </Flex>
    </Flex>
  )
}

export default EndpointOverview
