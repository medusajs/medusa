import React from "react"
import { Flex, Text } from "theme-ui"
import CodeBox from "./code-box"

const EndpointContainer = ({ endpoints }) => {
  if (!endpoints) return null

  return (
    <CodeBox header="ENDPOINTS">
      <Flex
        py={2}
        sx={{
          flexDirection: "column",
        }}
      >
        {endpoints.map((e, i) => {
          const method = e.method.toUpperCase()
          const endpoint = e.endpoint
          return (
            <Flex
              key={i}
              sx={{ fontSize: "0", fontFamily: "monospace", px: "3", py: "2" }}
            >
              <Text
                variant={`labels.${method}`}
                sx={{
                  width: "55px",
                  textAlign: "right",
                }}
                mr={2}
              >
                {method}
              </Text>
              <Text sx={{ color: "dark" }}>
                {endpoint.replace(/{(.*?)}/g, ":$1")}
              </Text>
            </Flex>
          )
        })}
      </Flex>
    </CodeBox>
  )
}

export default EndpointContainer
