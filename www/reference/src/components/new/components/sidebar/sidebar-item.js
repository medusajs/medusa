import React from "react"
import Collapsible from "react-collapsible"
import { Flex, Box, Text } from "rebass"
import { AnchorLink } from "gatsby-plugin-anchor-links"
import styled from "@emotion/styled"
import { convertToKebabCase } from "../../../../utils/convert-to-kebab-case"
import { navigate } from "gatsby"

const StyledNavItem = styled(Flex)`
  padding-left: 16px;
  padding-right: 10px;
  align-items: center;
  border-radius: 5pt;
  cursor: pointer;
  margin-bottom: 5px;
  height: 25px;
  color: var(--dark);
  &:hover {
    background-color: var(--faded);
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
    fill: var(--faded);
  }
  &:hover {
    ${props =>
      !props.active &&
      `
      background-color: var(--faded);
    `}
  }
  &.active {
    background-color: #e0e0e0;
  }
`

const SideBarItem = ({ item, api }) => {
  const { section } = item
  const subItems = section.paths
    .map(p => {
      return p.methods
    })
    .reduce((pre, cur) => {
      return pre.concat(cur)
    })
    .map(m => {
      return {
        title: m.summary,
        path: convertToKebabCase(m.summary),
      }
    })

  return (
    <Box>
      <Collapsible
        trigger={
          <StyledNavItem fontSize={1}>{section.section_name}</StyledNavItem>
        }
        onTriggerOpening={() =>
          navigate(`#${convertToKebabCase(section.section_name)}`)
        }
      >
        {subItems.map((si, i) => {
          return (
            <StyledAnchorLink key={i} to={`#${si.path}`}>
              <Text fontSize={0}>{si.title}</Text>
            </StyledAnchorLink>
          )
        })}
      </Collapsible>
    </Box>
  )
}

export default SideBarItem
