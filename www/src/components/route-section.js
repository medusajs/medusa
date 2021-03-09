import React, { useState, useEffect } from "react"
import { Flex, Box, Text, Image } from "rebass"

const RouteSection = ({ basePath, path, method }) => {
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
