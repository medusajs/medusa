import React from "react"
import { Flex, Box, Text } from "rebass"

const RouteSection = ({ basePath, path, method }) => {
  path = path.replaceAll(/{(.*?)}/g, ":$1")

  return (
    <Box py={2}>
      <Flex fontFamily="monospace">
        <Text mr={2} variant={`labels.${method}`}>
          {method}
        </Text>
        <Text>{`${basePath}${path === "/" ? "" : path}`}</Text>
      </Flex>
    </Box>
  )
}

export default RouteSection
