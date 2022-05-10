import { Box, Flex, Text } from "theme-ui"
import React, { useContext, useEffect, useState } from "react"

import ChevronDown from "../icons/chevron-down"
import Collapsible from "react-collapsible"
import NavigationContext from "../../context/navigation-context"
import { convertToKebabCase } from "../../utils/convert-to-kebab-case"
import styled from "@emotion/styled"

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
  const [isOpen, setIsOpen] = useState(false);
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
        openSection({id, section})
      }
    }
  }

  const handleSubClick = path => {
    const id = convertToKebabCase(section.section_name)
    goTo({ section: id, method: path, sectionObj: section })
  }

  useEffect(() => {
    setIsOpen(currentSection === convertToKebabCase(section.section_name) ||
    openSections.includes(convertToKebabCase(section.section_name)));
  }, [section.section_name, currentSection, openSections])

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
                backgroundColor: "primary",
                color: "light"
              },
              "&:hover svg, &.active svg": {
                color: "light"
              }
            }}
            className={
              currentSection === convertToKebabCase(section.section_name)
                ? "active"
                : null
            }
          >
            {section.section_name} <ChevronDown fill={"light"} />
          </Flex>
        }
        open={isOpen}
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
                color: "text",
                height: "25px",
                "&:hover": {
                  backgroundColor: "primary",
                  color: "light"
                },
                "&.active": {
                  backgroundColor: "primary",
                  color: "light"
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
