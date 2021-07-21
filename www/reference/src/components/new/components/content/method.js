import React from "react"
import Markdown from "react-markdown"
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
      <Text mb={3} fontSize={3}>
        {data.summary}
      </Text>
      <Route path={pathname} method={data.method} />
      <Text lineHeight="26px">
        <Markdown>{data.description}</Markdown>
      </Text>
      <Parameters params={data.requestBody} />
    </Flex>
  )
}

export default Method
