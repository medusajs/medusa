import React from "react"
import { Flex, Text } from "rebass"
import Parameters from "./parameters"
import Route from "./route"

const Method = ({ data, pathname }) => {
  return (
    <Flex
      flexDirection="column"
      py={4}
      sx={{
        borderBottom: "hairline",
      }}
    >
      <Text mb={3} fontSize={4}>
        {data.summary}
      </Text>
      <Route path={pathname} method={data.method} />
      <Text mt={3} lineHeight="26px">
        {data.description}
      </Text>
      <Parameters params={data.requestBody} />
    </Flex>
  )
}

export default Method
