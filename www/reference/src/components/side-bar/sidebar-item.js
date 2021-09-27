import React, { useContext } from "react"
import Collapsible from "react-collapsible"
import { Flex, Box, Text } from "theme-ui"
import styled from "@emotion/styled"
import { convertToKebabCase } from "../../utils/convert-to-kebab-case"
import ChevronDown from "../icons/chevron-down"
import NavigationContext from "../../context/navigation-context"

const StyledCollapsible = styled(Collapsible)`
  margin-bottom: 10px;
`

const Container = styled(Box)`
  div.Collapsible span.Collapsible__trigger.is-open {
    svg {
      transform: rotate(180deg);
    }
  }
`

const SideBarItem = ({ item }) => {
  const {
    openSection,
    openSections,
    currentHash,
    currentSection,
    goTo,
  } = useContext(NavigationContext)
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

  const handleClick = () => {
    const id = convertToKebabCase(section.section_name)
    const element = document.querySelector(`#${id}`)
    if (element) {
      element.scrollIntoView()
      if (!openSections.includes(id)) {
        openSection(id)
      }
    }
  }

  const handleSubClick = path => {
    const id = convertToKebabCase(section.section_name)
    goTo({ section: id, method: path })
  }

  return (
    <Container id={`nav-${convertToKebabCase(section.section_name)}`}>
      <StyledCollapsible
        trigger={
          <Flex
            sx={{
              fontSize: "1",
              pl: "16px",
              pr: "10px",
              alignItems: "center",
              borderRadius: "small",
              cursor: "pointer",
              mr: "4px",
              mb: "5px",
              height: "25px",
              justifyContent: "space-between",
              "&:hover, &.active": {
                backgroundColor: "faded",
              },
            }}
            className={
              currentSection === convertToKebabCase(section.section_name)
                ? "active"
                : null
            }
          >
            {section.section_name} <ChevronDown />
          </Flex>
        }
        open={
          currentSection === convertToKebabCase(section.section_name) ||
          openSections.includes(convertToKebabCase(section.section_name))
        }
        onTriggerOpening={handleClick}
        transitionTime={1}
      >
        {subItems.map((si, i) => {
          const path = convertToKebabCase(si.path)
          return (
            <Flex
              key={i}
              className={currentHash === path ? "active" : null}
              onClick={() => handleSubClick(path)}
              id={`nav-${path}`}
              sx={{
                ml: "10px",
                pl: "10px",
                pr: "10px",
                alignItems: "center",
                borderRadius: "small",
                cursor: "pointer",
                mb: "8px",
                textDecoration: "none",
                color: "black",
                height: "25px",
                "&:hover": {
                  backgroundColor: "faded",
                },
                "&.active": {
                  backgroundColor: "faded",
                },
              }}
            >
              <Text
                sx={{
                  fontSize: "0",
                }}
              >
                {si.title}
              </Text>
            </Flex>
          )
        })}
      </StyledCollapsible>
    </Container>
  )
}

export default SideBarItem
