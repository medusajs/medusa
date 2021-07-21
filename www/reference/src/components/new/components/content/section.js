import React from "react"
import { Flex, Box, Heading, Text } from "rebass"
import Method from "./method"

const convertToKebabCase = string => {
  return string.replace(/\s+/g, "-").toLowerCase()
}

const Section = ({ data }) => {
  const { section } = data
  console.log(section)
  return (
    <Box
      sx={{
        borderBottom: "hairline",
        padding: "5vw",
      }}
    >
      <Flex
        flexDirection="column"
        id={convertToKebabCase(section.section_name)}
      >
        <Heading>{section.section_name}</Heading>
        <Text>{section.schema?.description}</Text>
        {section.paths.map((p, i) => {
          return (
            <Flex key={i} flexDirection="column">
              {p.methods.map((m, i) => {
                return <Method key={i} data={m} pathname={p.name} />
              })}
            </Flex>
          )
        })}
      </Flex>
    </Box>
  )
}

export default Section
