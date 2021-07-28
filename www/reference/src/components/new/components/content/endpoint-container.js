import styled from "@emotion/styled"
import React from "react"
import { Flex, Text } from "rebass"
import CodeBox from "./code-box"

const Endpoint = styled(Flex)`
  padding: 5px 10px;
`

const EndpointContainer = ({ endpoints }) => {
  if (!endpoints) return null

  return (
    <CodeBox header="ENDPOINTS" sticky={false}>
      <Flex flexDirection="column" py={2}>
        {endpoints.map((e, i) => {
          const method = e.method.toUpperCase()
          const endpoint = e.endpoint
          return (
            <Endpoint key={i} fontSize={1}>
              <Text
                width="55px"
                textAlign="right"
                mr={2}
                variant={`labels.${method}`}
              >
                {method}
              </Text>
              <Text sx={{ color: "var(--dark)" }}>
                {endpoint.replace(/{(.*?)}/g, ":$1")}
              </Text>
            </Endpoint>
          )
        })}
      </Flex>
    </CodeBox>
  )
}

export default EndpointContainer
