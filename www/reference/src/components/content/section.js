import React, { useState, useRef, useEffect, useContext } from "react"
import { Flex, Box, Heading, Text, Button } from "theme-ui"
import Method from "./method"
import Parameters from "./parameters"
import { convertToKebabCase } from "../../utils/convert-to-kebab-case"
import EndpointContainer from "./endpoint-container"
import styled from "@emotion/styled"
import Markdown from "react-markdown"
import JsonContainer from "./json-container"
import ResponsiveContainer from "./responsive-container"
import Description from "./description"
import NavigationContext from "../../context/navigation-context"
import ChevronDown from "../icons/chevron-down"
import useInView from "../../hooks/use-in-view"

const SectionHeader = styled(Heading)`
  /* top: -1px;
  padding-top: 1px; */
`

const Section = ({ data }) => {
  const { section } = data
  const [isExpanded, setIsExpanded] = useState(false)
  const { openSections, updateSection, api } = useContext(NavigationContext)

  const endpoints = section.paths
    .map(p => {
      let path = p.name
      let ep = []

      p.methods.forEach(m => {
        ep.push({ method: m.method, endpoint: path })
      })

      return ep
    })
    .flat()

  const sectionRef = useRef(null)

  const handleExpand = () => {
    setIsExpanded(true)
  }

  useEffect(() => {
    if (isExpanded) {
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        })
      }
    }
  }, [isExpanded])

  useEffect(() => {
    const shouldOpen = openSections.includes(
      convertToKebabCase(section.section_name)
    )

    if (shouldOpen) {
      setIsExpanded(true)
    }
  }, [section.section_name, openSections, openSections.length])

  const [containerRef, isInView] = useInView({
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  })

  useEffect(() => {
    if (isInView) {
      updateSection(convertToKebabCase(section.section_name))
    }
  }, [isInView])

  return (
    <section ref={sectionRef} id={convertToKebabCase(section.section_name)}>
      <Box
        sx={{
          borderBottom: "hairline",
          padding: "5vw",
        }}
        bg={isExpanded ? "transparent" : "var(--faded-contrast)"}
        ref={containerRef}
      >
        <SectionHeader
          as="h1"
          mb={3}
          sx={{
            fontWeight: "500",
            fontSize: "22",
          }}
          className={`header-${convertToKebabCase(section.section_name)}`}
        >
          {section.section_name}
        </SectionHeader>
        <Flex
          sx={{
            flexDirection: "column",
          }}
        >
          <ResponsiveContainer>
            <Flex
              sx={{ flexDirection: "column", lineHeight: "26px" }}
              className="info"
              pr={5}
            >
              <Description>
                <Text mb={4}>
                  <Markdown>{section.schema?.description}</Markdown>
                </Text>
              </Description>
              {isExpanded && section.schema ? (
                <Parameters params={section.schema} type={"attr"} />
              ) : null}
            </Flex>
            <Flex
              className="code"
              sx={{
                flexDirection: "column",
              }}
            >
              <EndpointContainer endpoints={endpoints} />
              {isExpanded ? (
                <JsonContainer
                  json={section.schema?.object}
                  header={`${section.section_name.toUpperCase()} OBJECT`}
                />
              ) : null}
            </Flex>
          </ResponsiveContainer>
          {isExpanded ? (
            <Box mt={4}>
              {section.paths.map((p, i) => {
                return (
                  <Flex
                    key={i}
                    sx={{
                      flexDirection: "column",
                    }}
                  >
                    {p.methods.map((m, i) => {
                      return (
                        <Method
                          key={i}
                          data={m}
                          section={convertToKebabCase(section.section_name)}
                          pathname={p.name}
                        />
                      )
                    })}
                  </Flex>
                )
              })}
            </Box>
          ) : (
            <Flex
              sx={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
              mt={4}
            >
              <Button
                onClick={handleExpand}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "24px",
                  bg: "light",
                  fontWeight: "500",
                }}
              >
                SHOW <ChevronDown fill={"dark"} styles={{ mr: "-10px" }} />
              </Button>
            </Flex>
          )}
        </Flex>
      </Box>
    </section>
  )
}

export default Section
