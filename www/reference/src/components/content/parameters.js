import React from "react"
import { Flex, Text, Box } from "theme-ui"
import Markdown from "react-markdown"
import NestedCollapsible from "./collapsible"
import Description from "./description"

const Parameters = ({ params, type }) => {
  return (
    <Flex
      sx={{
        flexDirection: "column",
      }}
    >
      <Text pb="2">{type === "attr" ? "Attributes" : "Parameters"}</Text>
      {params.properties.length > 0 ? (
        params.properties.map((prop, i) => {
          const nested = prop.nestedModel || prop.items?.properties || null
          return (
            <Box
              py={2}
              sx={{
                borderTop: "hairline",
                fontFamily: "monospace",
                fontSize: "0",
              }}
              key={i}
            >
              <Flex sx={{ alignItems: "baseline", fontSize: "0" }}>
                <Text mr={2}>{prop.property || prop.name}</Text>
                <Text color={"gray"}>
                  {prop.type || prop.schema?.type || nested?.title}
                </Text>
                {prop.required ? (
                  <Text ml={1} variant="labels.required">
                    required
                  </Text>
                ) : null}
              </Flex>
              <Description>
                <Text
                  sx={{
                    fontSize: "0",
                    lineHeight: "26px",
                    fontFamily: "body",
                  }}
                >
                  <Markdown>{prop.description}</Markdown>
                </Text>
              </Description>
              {nested?.properties && (
                <NestedCollapsible
                  properties={nested.properties}
                  title={nested.title}
                />
              )}
            </Box>
          )
        })
      ) : (
        <Text sx={{ fontSize: "0", py: "3", fontFamily: "monospace" }}>
          No parameters
        </Text>
      )}
    </Flex>
  )
}

export default Parameters
