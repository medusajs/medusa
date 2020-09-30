import React, { useState, useEffect } from "react"
import { graphql } from "gatsby"
import { Flex, Box, Text } from "rebass"
import { AnchorLink } from "gatsby-plugin-anchor-links"
import Highlight from "react-highlight.js"
import { Helmet } from "react-helmet"
import { InView } from "react-intersection-observer"

import Layout from "../../components/layout"
import "highlight.js/styles/a11y-dark.css"

const convertToKebabCase = string => {
  return string.replace(/\s+/g, "-").toLowerCase()
}

const JsonBox = ({ content }) => {
  const json = JSON.parse(content)
  return (
    <Flex
      sx={{
        border: "1px solid #454545",
        backgroundColor: "dark",
        borderRadius: "5px",
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
        maxHeight: "calc(90vh - 20px)",
        overflowY: "scroll",
        alignSelf: "flex-start",
        fontSize: "1",
        position: "sticky",
        top: "20px",
        bottom: "20px",
      }}
      flexDirection="column"
      as="pre"
    >
      <Text fontSize={0} fontFamily="body" py={1} px={2} color="lightest">
        RESPONSE
      </Text>
      <Box w={1} flex="1" sx={{ overflowY: "scroll" }}>
        <Highlight language="json">
          {JSON.stringify(json, undefined, 2)}
        </Highlight>
      </Box>
    </Flex>
  )
}

const ParamSection = ({ routeParam, param }) => {
  return (
    <Box
      py={2}
      sx={{
        borderTop: "hairline",
      }}
    >
      <Flex fontSize="1" alignItems="center" pb={2} fontFamily="monospace">
        <Box mr={2}>{param.name}</Box>
        {(param.required || routeParam) && (
          <Text variant="labels.required">required</Text>
        )}
      </Flex>
      <Text fontSize="1">{param.description}</Text>
    </Box>
  )
}

const RouteSection = ({ path, method }) => {
  return (
    <Box py={2}>
      <Flex fontFamily="monospace">
        <Text mr={2} variant={`labels.${method}`}>
          {method}
        </Text>
        <Text>{path}</Text>
      </Flex>
    </Box>
  )
}

const SideBar = ({ endpoints }) => {
  return (
    <Flex
      p={3}
      sx={{
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "scroll",
        backgroundColor: "light",
        minWidth: "250px",
      }}
      flexDirection="column"
    >
      {endpoints.edges.map(({ node }) => {
        return (
          <Box py={3}>
            <Text fontSize={1} mb={2} sx={{ textTransform: "uppercase" }}>
              {node.title}
            </Text>
            {node.endpoints.map(e => (
              <AnchorLink to={`#${convertToKebabCase(e.title)}`}>
                <Text mb={2} fontSize={0}>
                  {e.title}
                </Text>
              </AnchorLink>
            ))}
          </Box>
        )
      })}
    </Flex>
  )
}

const StoreApi = ({ data }) => {
  let { endpoints } = data

  return (
    <Layout>
      <Helmet>
        <title>Store API | Medusa Commerce</title>
      </Helmet>
      <Flex>
        <SideBar endpoints={endpoints} />
        <Flex p={3} flexDirection="column">
          {endpoints.edges.map(({ node }) => (
            <Flex
              id={convertToKebabCase(node.title)}
              sx={{
                minHeight: "90vh",
                position: "relative",
              }}
            >
              <Flex flexDirection="column" flex="60%" maxWidth={756}>
                <Flex
                  sx={{
                    borderBottom: "hairline",
                  }}
                  py={5}
                  flexDirection="column"
                  borderBottom="hairline"
                >
                  <Text mb={3} fontSize={4}>
                    {node.title}
                  </Text>
                  <Text fontFamily="monospace" my={2}>
                    {node.route}
                  </Text>
                  <Text mb={4}>{node.description}</Text>
                  {node.endpoints.map(endpoint => (
                    <Flex
                      id={convertToKebabCase(endpoint.title)}
                      sx={{
                        borderTop: "hairline",
                      }}
                      py={4}
                      flexDirection="column"
                    >
                      <Text mb={3} fontSize={3}>
                        {endpoint.title}
                      </Text>
                      <RouteSection
                        method={endpoint.method}
                        path={endpoint.path}
                      />
                      <Text>{endpoint.description}</Text>
                      {((endpoint.params && endpoint.params.length) ||
                        (endpoint.body && endpoint.body.length)) && (
                        <Box
                          sx={{
                            borderBottom: "hairline",
                          }}
                          my="2"
                        >
                          <Text my={2}>Parameters</Text>
                          {(endpoint.params || []).map(p => (
                            <ParamSection routeParam param={p} />
                          ))}
                          {(endpoint.body || []).map(p => (
                            <ParamSection param={p} />
                          ))}
                        </Box>
                      )}
                    </Flex>
                  ))}
                </Flex>
              </Flex>
              <Flex py={5} px={3} minWidth={450} flex="1">
                <JsonBox name={node.title} content={node.response} />
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Layout>
  )
}

export default StoreApi

export const pageQuery = graphql`
  {
    endpoints: allEndpointsYaml(filter: { domain: { eq: "store" } }) {
      edges {
        node {
          id
          title
          route
          response
          description
          endpoints {
            title
            path
            params {
              description
              name
              type
            }
            method
            description
            body {
              type
              required
              name
              description
            }
          }
        }
      }
    }
  }
`
