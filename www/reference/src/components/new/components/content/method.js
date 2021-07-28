import React from "react"
import Markdown from "react-markdown"
import { Flex, Text, Box, Heading } from "rebass"
import { convertToKebabCase } from "../../../../utils/convert-to-kebab-case"
import Parameters from "./parameters"
import Route from "./route"
import JsonContainer from "./json-container"
import Description from "./description"
import ResponsiveContainer from "./responsive-container"

const Method = ({ data, pathname }) => {
  return (
    <Flex
      flexDirection="column"
      py={4}
      sx={{
        borderTop: "hairline",
      }}
      id={convertToKebabCase(data.summary)}
    >
      <Heading as="h1" mb={4} fontSize={4} fontWeight={500}>
        {data.summary}
      </Heading>
      <ResponsiveContainer>
        <Flex className="info" flexDirection="column" pr={5}>
          <Route path={pathname} method={data.method} />
          <Description>
            <Text lineHeight="26px" mt={3}>
              <Markdown>{data.description}</Markdown>
            </Text>
          </Description>
          <Box mt={4}>
            <Parameters params={data.requestBody} />
          </Box>
        </Flex>
        <Box className="code">
          <JsonContainer
            json={data.responses[0].content?.[0].json}
            header={"RESPONSE"}
          />
        </Box>
      </ResponsiveContainer>
    </Flex>
  )
}

export default Method
