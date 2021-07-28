import React from "react"
import { Flex, Text, Box } from "rebass"
import Markdown from "react-markdown"
import NestedCollapsible from "./collapsible"
import Description from "./description"

const Parameters = ({ params, type }) => {
  return (
    <Flex flexDirection="column">
      <Text pb="12px">{type === "attr" ? "Attributes" : "Parameters"}</Text>
      {params.properties.length > 0 ? (
        params.properties.map((prop, i) => {
          const nested = prop.nestedModel || prop.items?.properties || null
          return (
            <Box
              py={2}
              sx={{
                borderTop: "hairline",
              }}
              fontFamily="monospace"
              key={i}
            >
              <Flex alignItems="baseline">
                <Text mr={2} fontSize={"12px"}>
                  {prop.property || prop.name}
                </Text>
                <Text color={"gray"} fontSize={"10px"}>
                  {prop.type || prop.schema?.type || nested?.title}
                </Text>
                {params.required && params.required.includes(prop.property) && (
                  <Text ml={1} fontSize={"10px"} variant="labels.required">
                    required
                  </Text>
                )}
              </Flex>
              <Description>
                <Text fontSize={0} lineHeight="26px" fontFamily="body">
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
        <Text fontSize="12px" py={3} fontFamily="monospace">
          No parameters
        </Text>
      )}
    </Flex>
  )
}

export default Parameters
