import React from "react"
import { Flex, Box, Text } from "rebass"

import RoutesOverview from "./routes-overview"

const EndpointOverview = ({ title, description, routes }) => {
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
        <Text mb={4}>{description}</Text>
      </Flex>
      {routes && <RoutesOverview content={routes} />}
    </Flex>
  )
}

export default EndpointOverview
