import React from "react"
import styled from "@emotion/styled"
import { Flex, Box, Text } from "rebass"
import Markdown from "react-markdown"
import Collapsible from "react-collapsible"

import { deref } from "../utils/deref"

const ExpandContainer = styled.div`
  .child-attrs {
    cursor: pointer;
    font-size: 12px;
    box-sizing: border-box;
    padding-left: 10px;
    padding-right: 10px;
    width: max-content;
    border-radius: 5px;
    border: 1px solid #e3e8ee;
    color: #afafaf;

    &:hover {
      color: #212121;
    }
  }
  .child-attrs.is-open {
    width: 100%;
    border-bottom: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`

const Expand = ({ schema, spec }) => {
  if (schema.$ref) {
    const [, ...path] = schema.$ref.split("/")
    schema = deref(path, spec)
  }

  const properties = schema.properties

  let aggregated = []
  for (const [name, details] of Object.entries(properties)) {
    let cleanDets = details

    if (name === "$ref") {
      const [, ...path] = details.split("/")
      cleanDets = deref(path, spec)
    }

    if (!aggregated.find(a => a.name === name)) {
      aggregated.push({
        name,
        ...cleanDets,
      })
    }
  }

  return (
    <ExpandContainer>
      <Collapsible
        transitionTime={50}
        triggerClassName={"child-attrs"}
        triggerOpenedClassName={"child-attrs"}
        triggerTagName="div"
        trigger={"Show nested attributes"}
        triggerWhenOpen={"Hide"}
      >
        <Box
          sx={{
            padding: "10px",
            borderRadius: "5px",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            border: "hairline",
          }}
          mb="2"
        >
          <Text my={2}>{schema.title}</Text>
          {aggregated.map(param => {
            let type = param.type
            if (!type && param.schema) {
              type = param.schema.type
            }
            return (
              <Box
                py={2}
                sx={{
                  borderTop: "hairline",
                }}
              >
                <Flex
                  fontSize="1"
                  alignItems="baseline"
                  pb={1}
                  fontFamily="monospace"
                >
                  <Box mr={2} fontSize={"12px"}>
                    {param.name}
                  </Box>
                  <Text color={"gray"} fontSize={"10px"}>
                    {type}
                  </Text>
                  {param.required && (
                    <Text ml={1} fontSize={"10px"} variant="labels.required">
                      required
                    </Text>
                  )}
                </Flex>
                <Text fontSize={0}>
                  <Markdown>{param.description}</Markdown>
                </Text>
              </Box>
            )
          })}
        </Box>
      </Collapsible>
    </ExpandContainer>
  )
}

const ParamSection = ({ routeParam, param, spec }) => {
  let type = param.type
  if (!type && param.schema) {
    type = param.schema.type
  }

  return (
    <Box
      py={2}
      sx={{
        borderTop: "hairline",
      }}
    >
      <Flex fontSize="1" alignItems="baseline" pb={1} fontFamily="monospace">
        <Box mr={2} fontSize={"12px"}>
          {param.name}
        </Box>
        <Text color={"gray"} fontSize={"10px"}>
          {type}
        </Text>
        {(param.required || routeParam) && (
          <Text ml={1} fontSize={"10px"} variant="labels.required">
            required
          </Text>
        )}
      </Flex>
      <Text fontSize={0}>
        <Markdown>{param.description}</Markdown>
      </Text>
      {param.anyOf &&
        param.anyOf.map(schema => <Expand schema={schema} spec={spec} />)}
      {param.oneOf &&
        param.oneOf.map(schema => <Expand schema={schema} spec={spec} />)}
      {param.type === "array" && param.items?.properties && (
        <Expand schema={param.items} spec={spec} />
      )}
    </Box>
  )
}

export default ParamSection
