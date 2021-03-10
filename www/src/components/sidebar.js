import React, { useState, useEffect } from "react"
import { Link, navigate } from "gatsby"
import { Flex, Box, Text } from "rebass"
import { AnchorLink } from "gatsby-plugin-anchor-links"
import styled from "@emotion/styled"
import Collapsible from "react-collapsible"

import Select from "./select"

const convertToKebabCase = string => {
  return string.replace(/\s+/g, "-").toLowerCase()
}

const StyledNavItem = styled(Flex)`
  padding-left: 16px;
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
  margin-left: 10px;
  padding-left: 10px;
  padding-right: 10px;
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

const StyledLink = styled(Link)`
  color: #212121;
  font-decoration: none;
`

const SideBar = ({ tags }) => {
  const [api, setApi] = useState("store")

  useEffect(() => {
    const pathname = window.location.pathname
    const matches = pathname.match(/api\/(store|admin)/)
    if (pathname.length > 1) {
      setApi(matches[1])
    }
  }, [])

  return (
    <SideBarContainer>
      <Flex
        width="100%"
        alignContent="center"
        justifyContent={"center"}
        sx={{ borderBottom: "hairline" }}
        px={4}
        py={3}
        mb={3}
        justifyContent="center"
        flexDirection="column"
      >
        <Flex width={"100%"} alignContent="center">
          <Text
            fontFamily="Medusa"
            fontSize="26px"
            color="#454b54"
            fontWeight={300}
          >
            medusa
          </Text>
        </Flex>
        <Flex pt={3} justifyContent="space-between">
          <Select
            value={api}
            onChange={e => navigate(`/api/${e.target.value}`)}
            options={[
              { value: "admin", label: "Admin" },
              { value: "store", label: "Storefront" },
            ]}
          />
        </Flex>
      </Flex>
      {Object.entries(tags).map(([tag, details]) => {
        return (
          <Box pt={1} px={3}>
            <Collapsible
              transitionTime={50}
              trigger={<StyledNavItem fontSize={1}>{tag}</StyledNavItem>}
            >
              {details.map(e => (
                <StyledAnchorLink to={`#${convertToKebabCase(e.summary)}`}>
                  <Text fontSize={0}>{e.summary}</Text>
                </StyledAnchorLink>
              ))}
            </Collapsible>
          </Box>
        )
      })}
    </SideBarContainer>
  )
}

export default SideBar
