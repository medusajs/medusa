import React, { useState, useRef, useEffect, useContext } from "react"
import { Flex, Box, Heading, Text, Button } from "theme-ui"
import Method from "./method"
import Parameters from "./parameters"
import { convertToKebabCase } from "../../utils/convert-to-kebab-case"
import EndpointContainer from "./endpoint-container"
import Markdown from "react-markdown"
import JsonContainer from "./json-container"
import ResponsiveContainer from "./responsive-container"
import Description from "./description"
import NavigationContext from "../../context/navigation-context"
import ChevronDown from "../icons/chevron-down"
import useInView from "../../hooks/use-in-view"

const Section = ({ data }) => {
  const { section } = data
  const [isExpanded, setIsExpanded] = useState(true)
  const { openSections, updateSection, updateMetadata } = useContext(
    NavigationContext
  )

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

  const scrollIntoView = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
      })
    }
  }

  const handleExpand = () => {
    updateMetadata({
      title: section.section_name,
      description: section.schema?.description,
    })
    setIsExpanded(true)
    scrollIntoView()
  }

  useEffect(() => {
    setIsExpanded(false)
  }, [])

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
    rootMargin: "0px 0px -80% 0px",
    threshold: 1.0,
  })

  useEffect(() => {
    const handleInView = () => {
      if (isInView) {
        updateSection(convertToKebabCase(section.section_name))
      }
    }
    handleInView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView])

  return (
    <main
      ref={sectionRef}
      id={convertToKebabCase(section.section_name)}
      className="DocSearch-content"
    >
      <Box
        sx={{
          borderBottom: "hairline",
          padding: "5vw",
          backgroundColor: isExpanded ? "transparent" : "fadedContrast",
        }}
      >
        <Flex>
          <Heading
            as="h1"
            sx={{
              fontWeight: "500",
              fontSize: "22",
              mb: "3",
              cursor: "pointer",
            }}
            ref={containerRef}
            className={`header-${convertToKebabCase(section.section_name)}`}
            onClick={handleExpand}
          >
            {section.section_name}
          </Heading>
        </Flex>
        <Flex
          sx={{
            flexDirection: "column",
          }}
        >
          <ResponsiveContainer>
            <Flex
              sx={{
                flexDirection: "column",
                lineHeight: "26px",
                pr: "5",
                "@media screen and (max-width: 848px)": {
                  pr: "0",
                },
              }}
              className="info"
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
          {!isExpanded ? (
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
          ) : (
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
          )}
        </Flex>
      </Box>
    </main>
  )
}

export default Section
