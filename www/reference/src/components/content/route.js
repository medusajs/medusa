import React from "react"
import { Flex, Text } from "theme-ui"
import { formatRoute } from "../../utils/format-route"

const Route = ({ method, path }) => {
  const fixedMethod = method.toUpperCase()
  return (
    <Flex sx={{ fontFamily: "monospace" }}>
      <Text variant={`labels.${fixedMethod}`} mr={1}>
        {fixedMethod}
      </Text>
      <Text>{formatRoute(path)}</Text>
    </Flex>
  )
}

export default Route
