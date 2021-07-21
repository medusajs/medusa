import React from "react"
import { Flex, Text } from "rebass"

const Route = ({ method, path }) => {
  // const fixedPath = path.replaceAll("{", ":").replaceAll("}", "")
  const fixedMethod = method.toUpperCase()
  return (
    <Flex fontFamily="monospace">
      <Text variant={`labels.${fixedMethod}`} mr={1}>
        {fixedMethod}
      </Text>
      <Text>{path}</Text>
    </Flex>
  )
}

export default Route
