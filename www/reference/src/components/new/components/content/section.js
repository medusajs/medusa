import React from "react"
import { Flex, Box, Heading, Text } from "rebass"
import Method from "./method"
import Parameters from "./parameters"
import { convertToKebabCase } from "../../../../utils/convert-to-kebab-case"
import EndpointContainer from "./endpoint-container"
import styled from "@emotion/styled"
import Markdown from "react-markdown"
import JsonContainer from "./json-container"
import ResponsiveContainer from "./responsive-container"

const SectionHeader = styled(Heading)`
  /* position: sticky;
  top: -1px;

  padding-top: calc(1em + 1px);

  transition: all 0.2s;
  border-bottom: 1px solid transparent;
  z-index: 99;

  &.isSticky {
    background: var(--light);
    width: calc(100% + 10vw);
    padding: 10px 5vw;
    margin-left: -5vw;
    border-bottom: 1px solid var(--faded);
  } */
`

const Section = ({ data }) => {
  const { section } = data
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

  // useEffect(() => {
  //   const stickyHeader = document.querySelector(
  //     `.${convertToKebabCase("title " + section.section_name)}`
  //   )

  //   const observer = new IntersectionObserver(
  //     ([e]) => e.target.classList.toggle("isSticky", e.intersectionRatio < 1),
  //     { threshold: [1] }
  //   )

  //   if (stickyHeader) observer.observe(stickyHeader)
  // }, [])

  if (section.section_name === "Collection") {
    console.log(section)
  }

  return (
    <Box
      sx={{
        borderBottom: "hairline",
        padding: "5vw",
      }}
      id={convertToKebabCase(section.section_name)}
    >
      <SectionHeader
        as="h1"
        fontSize="24px"
        fontWeight={500}
        mb={3}
        className={`${convertToKebabCase("title " + section.section_name)}`}
      >
        {section.section_name}
      </SectionHeader>
      <Flex flexDirection="column">
        <ResponsiveContainer width="100%">
          <Flex
            flexDirection="column"
            className="info"
            pr={5}
            sx={{ lineHeight: "26px" }}
          >
            <Text mb={4}>
              <Markdown>{section.schema?.description}</Markdown>
            </Text>
            {section.schema && (
              <Parameters params={section.schema} type={"attr"} />
            )}
          </Flex>
          <Flex className="code" flexDirection="column">
            <EndpointContainer endpoints={endpoints} />
            <JsonContainer json={section.schema?.object} header={"OBJECT"} />
          </Flex>
        </ResponsiveContainer>
        <Box mt={4}>
          {section.paths.map((p, i) => {
            return (
              <Flex key={i} flexDirection="column">
                {p.methods.map((m, i) => {
                  return <Method key={i} data={m} pathname={p.name} />
                })}
              </Flex>
            )
          })}
        </Box>
      </Flex>
    </Box>
  )
}

export default Section
