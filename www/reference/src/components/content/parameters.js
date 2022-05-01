import { Box, Flex, Text } from "theme-ui"

import Description from "./description"
import Markdown from "react-markdown"
import NestedCollapsible from "./collapsible"
import React from "react"

const Parameters = ({ params, type }) => {
  const getDescriptions = (title, items) => {
    return (
      <>
        {items?.length > 0 && (
          <>
            <Text
              sx={{ borderLeft: "2px solid gray", alignItems: "center" }}
              my={3}
              pl={2}
              py={1}
            >
              {title === "attr" ? "Attributes" : title}
            </Text>
            {items.map((prop, i) => {
              const nested = prop.nestedModel || prop.items?.properties || null
              return (
                <Box
                  py={2}
                  pl={2}
                  sx={{
                    borderTop: "hairline",
                    fontFamily: "monospace",
                    fontSize: "0",
                  }}
                  key={i}
                >
                  <Flex sx={{ alignItems: "baseline", fontSize: "0" }}>
                    <Text mr={2}>{prop.property || prop.name}</Text>
                    <Text color={"#707070"}>
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
            })}
          </>
        )}
      </>
    )
  }

  return (
    <Flex
      sx={{
        flexDirection: "column",
      }}
    >
      {getDescriptions(type, params.properties)}
      {getDescriptions("Request body", params.body)}
    </Flex>
  )
}

export default Parameters
