import React from "react"
import { Flex, Text } from "rebass"
import styled from "@emotion/styled"
import Markdown from "react-markdown"

import RouteSection from "./route-section"
import JsonBox from "./json-box"
import EndpointOverview from "./endpoint-overview"
import Parameters from "./parameters"

const convertToKebabCase = string => {
  return string.replace(/\s+/g, "-").toLowerCase()
}

const EndpointContainer = styled(Flex)`
  min-height: 90vh;
  position: relative;
  border-top: hairline;

  code {
    background-color: #e3e8ee;
    border-radius: 5px;
    padding: 4px;
  }
`

const DocsReader = ({ tags, spec }) => {
  return (
    <Flex flexDirection="column" width="100%">
      {Object.entries(tags).map(([tagName, endpoints]) => (
        <EndpointContainer id={convertToKebabCase(tagName)} p={4}>
          <Flex flexDirection="row" width="100%">
            <Flex py={5} flexDirection="column" p={4} width="100%">
              <EndpointOverview
                title={tagName}
                description={""}
                routes={endpoints}
                spec={spec}
              />
              <Flex
                flexDirection="row"
                width={"100%"}
                sx={{
                  position: "relative",
                  borderTop: "hairline",
                }}
              >
                <Flex width={"100%"} flexDirection="column">
                  {endpoints.map((endpoint, i) => (
                    <Flex
                      id={convertToKebabCase(endpoint.summary)}
                      py={4}
                      flexDirection="row"
                      width="100%"
                    >
                      <Flex
                        pr={5}
                        width={"55%"}
                        flexDirection="column"
                        sx={{ lineHeight: "26px" }}
                      >
                        <Text mb={3} fontSize={3}>
                          {endpoint.summary}
                        </Text>
                        <RouteSection
                          basePath={""}
                          method={endpoint.method}
                          path={endpoint.path}
                        />
                        <Markdown>{endpoint.description}</Markdown>
                        <Parameters spec={spec} endpoint={endpoint} />
                      </Flex>
                      <Flex py={5} width="45%" flex="1">
                        <JsonBox
                          name={tagName}
                          endpoint={endpoint}
                          spec={spec}
                        />
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </EndpointContainer>
      ))}
    </Flex>
  )
}

export default DocsReader
