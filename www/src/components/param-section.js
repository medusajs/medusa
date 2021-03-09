import React from "react"
import { Flex, Box, Text } from "rebass"

const ParamSection = ({ routeParam, param }) => {
  let type = param.type
  if (!type && param.schema) {
    type = param.schema.type
  }

  return (
    <Box
      py={2}
      sx={{
        borderTop: "hairline",
      }}
    >
      <Flex fontSize="1" alignItems="baseline" pb={2} fontFamily="monospace">
        <Box mr={2} fontSize={"12px"}>
          {param.name}
        </Box>
        <Text color={"gray"} fontSize={"10px"}>
          {type}
        </Text>
        {(param.required || routeParam) && (
          <Text ml={1} fontSize={"10px"} variant="labels.required">
            required
          </Text>
        )}
      </Flex>
      <Text fontSize="1">{param.description}</Text>
    </Box>
  )
}

export default ParamSection
