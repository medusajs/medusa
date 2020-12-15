import React, { useState, useEffect } from "react"
import { graphql } from "gatsby"
import { Flex, Box, Text, Image } from "rebass"
import styled from "@emotion/styled"
import { AnchorLink } from "gatsby-plugin-anchor-links"
import Markdown from "react-markdown"
import Highlight from "react-highlight.js"
import { Helmet } from "react-helmet"
import Collapsible from "react-collapsible"
import logo from "../../images/logo.png"

import Layout from "../../components/layout"
import "highlight.js/styles/a11y-light.css"

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

const StyledRoutesOverview = styled(Flex)`
  border: 1px solid #e3e8ee;
  border-radius: 5px;
  margin-left: auto;
  margin-right: auto;
  width: 45%;
  max-height: calc(90vh - 20px);
  overflow-y: scroll;
  align-self: flex-start;
  font-size: 1;
  top: 20px;
  bottom: 20px;
`

const ResponseContainer = styled(Flex)`
  border: 1px solid #e3e8ee;
  border-radius: 5px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-height: calc(90vh - 20px);
  overflow-y: scroll;
  align-self: flex-start;
  font-size: 1;
  position: sticky;
  top: 20px;
  bottom: 20px;

  code {
    background: #f7fafc !important;
  }
`

const StyledNavItem = styled(Flex)`
  padding-left: 10px;
  padding-right: 10px;
  align-items: center;
  border-radius: 5pt;
  cursor: pointer;
  margin-bottom: 5px;
  height: 25px;

  &:hover {
    background-color: #e0e0e059;
  }
`

const StyledAnchorLink = styled(AnchorLink)`
  display: flex;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 10px;
  align-items: center;
  border-radius: 5pt;
  cursor: pointer;
  margin-bottom: 5px;
  text-decoration: none;
  align-items: center;
  color: black;
  height: 25px;
  [fill*="red"] {
    fill: #454545;
  }
  &:hover {
    ${props =>
      !props.active &&
      `
      background-color: #e0e0e059;
    `}
  }
  &.active {
    background-color: #e0e0e0;
  }
`

const SideBarContainer = styled(Flex)`
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: scroll;
  background-color: #f0f0f0;
  min-width: 250px;
  flex-direction: column;
`

const convertToKebabCase = string => {
  return string.replace(/\s+/g, "-").toLowerCase()
}

const RoutesOverview = ({ content }) => {
  if (!content) return null

  return (
    <StyledRoutesOverview flexDirection="column">
      <Text
        fontSize={0}
        fontFamily="body"
        py={2}
        px={3}
        color="#4f566b"
        backgroundColor="#e3e8ee"
      >
        ENDPOINTS
      </Text>
      <Box
        w={1}
        px={4}
        py={2}
        flex="1"
        sx={{ overflowY: "scroll" }}
        backgroundColor="#f7fafc"
      >
        <Flex fontSize={1} flexDirection="column">
          {content.map(route => (
            <Flex mb={2} width="100%">
              <Text
                width="55px"
                mr={2}
                variant={`labels.${route.method}`}
                textAlign="right"
              >
                {route.method}
              </Text>
              <Text color="#4f566b">{route.path}</Text>
            </Flex>
          ))}
        </Flex>
      </Box>
    </StyledRoutesOverview>
  )
}

const JsonBox = ({ content }) => {
  const json = JSON.parse(content)
  return (
    <ResponseContainer flexDirection="column" as="pre">
      <Text
        fontSize={0}
        fontFamily="body"
        py={2}
        px={3}
        color="#4f566b"
        backgroundColor="#e3e8ee"
      >
        RESPONSE
      </Text>
      <Box
        w={1}
        flex="1"
        sx={{ overflowY: "scroll" }}
        backgroundColor="#f7fafc"
      >
        <Highlight language="json">
          {JSON.stringify(json, undefined, 2)}
        </Highlight>
      </Box>
    </ResponseContainer>
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

const RouteSection = ({ basePath, path, method }) => {
  return (
    <Box py={2}>
      <Flex fontFamily="monospace">
        <Text mr={2} variant={`labels.${method}`}>
          {method}
        </Text>
        <Text>{`${basePath}${path === "/" ? "" : path}`}</Text>
      </Flex>
    </Box>
  )
}

const SideBar = ({ endpoints }) => {
  return (
    <SideBarContainer>
      <Flex
        width="100"
        alignContent="center"
        sx={{ borderBottom: "hairline" }}
        py={3}
        mb={3}
        justifyContent="center"
      >
        <Text
          fontFamily="Medusa"
          fontSize="26px"
          color="#454b54"
          fontWeight={300}
        >
          MEDUSA
        </Text>
      </Flex>
      {endpoints.edges.map(({ node }) => {
        return (
          <Box pt={3} px={3}>
            <Collapsible
              transitionTime={50}
              trigger={<StyledNavItem fontSize={1}>{node.title}</StyledNavItem>}
            >
              {node.endpoints.map(e => (
                <StyledAnchorLink to={`#${convertToKebabCase(e.title)}`}>
                  <Text fontSize={0}>{e.title}</Text>
                </StyledAnchorLink>
              ))}
            </Collapsible>
          </Box>
        )
      })}
    </SideBarContainer>
  )
}

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

const StoreApi = ({ data }) => {
  let { endpoints } = data

  return (
    <Layout>
      <Helmet>
        <title>Store API | Medusa Commerce</title>
      </Helmet>
      <Flex>
        <SideBar endpoints={endpoints} />
        <Flex flexDirection="column" width="100%">
          {endpoints.edges.map(({ node }) => (
            <EndpointContainer id={convertToKebabCase(node.title)} p={4}>
              <Flex flexDirection="row" width="100%">
                <Flex py={5} flexDirection="column" p={4} width="100%">
                  <EndpointOverview
                    title={node.title}
                    description={node.description}
                    route={node.route}
                    routes={node.routes}
                  />
                  <Flex
                    flexDirection="row"
                    sx={{
                      position: "relative",
                      borderTop: "hairline",
                    }}
                  >
                    <Flex width="55%" flexDirection="column" pr={5}>
                      {node.endpoints.map((endpoint, i) => (
                        <Flex
                          id={convertToKebabCase(endpoint.title)}
                          py={4}
                          flexDirection="row"
                          width="100%"
                        >
                          <Flex
                            flexDirection="column"
                            width="100%"
                            sx={{ lineHeight: "26px" }}
                          >
                            <Text mb={3} fontSize={3}>
                              {endpoint.title}
                            </Text>
                            <RouteSection
                              basePath={node.route}
                              method={endpoint.method}
                              path={endpoint.path}
                            />
                            <Markdown>{endpoint.description}</Markdown>
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
                                  <ParamSection
                                    routeParam={p.optional ? false : true}
                                    param={p}
                                  />
                                ))}
                                {(endpoint.body || []).map(p => (
                                  <ParamSection param={p} />
                                ))}
                              </Box>
                            )}
                          </Flex>
                        </Flex>
                      ))}
                    </Flex>
                    <Flex py={5} width="45%" flex="1">
                      <JsonBox name={node.title} content={node.response} />
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </EndpointContainer>
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
          routes {
            method
            path
          }
          route
          response
          description
          endpoints {
            title
            path
            params {
              description
              name
              optional
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
