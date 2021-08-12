import React, { useState } from "react"
import Collapsible from "react-collapsible"
import { Flex, Box, Text, Heading } from "theme-ui"
import Markdown from "react-markdown"
import Description from "./description"

const NestedCollapsible = ({ properties, title }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Box
      mt={2}
      sx={{
        "& .child-attrs": {
          cursor: "pointer",
          fontSize: "12px",
          p: "6px 10px",
          boxSizing: "border-box",
          width: "max-content",
          borderRadius: "small",
          border: "1px solid",
          borderColor: "faded",
        },

        "& .child-attrs.is-open": {
          width: "100%",
          borderBottom: "none",
          borderBottomLeftRadius: "0",
          borderBottomRightRadius: "0",
        },
      }}
    >
      <Collapsible
        transitionTime={50}
        triggerClassName={"child-attrs"}
        triggerOpenedClassName={"child-attrs"}
        triggerTagName="div"
        trigger={
          <Flex
            sx={{
              alignItems: "baseline",
              fontSize: "13px",
              fontWeight: "400",
            }}
          >
            <Box
              mr={1}
              className={isOpen ? "rotated" : null}
              sx={{
                userSelect: "none",
                transition: "all 0.2s ease",
                transform: "rotate(45deg)",
                "&.rotated": {
                  transform: "rotate(0deg)",
                },
              }}
            >
              &times;
            </Box>{" "}
            <Text
              sx={{ fontSize: "0", fontFamily: "body", userSelect: "none" }}
            >{`${isOpen ? "Hide" : "Show"} child attributes`}</Text>
          </Flex>
        }
        onTriggerOpening={() => setIsOpen(true)}
        onTriggerClosing={() => setIsOpen(false)}
      >
        <Box
          sx={{
            padding: "2",
            borderRadius: "small",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            border: "hairline",
            borderColor: "faded",
          }}
          mb="2"
        >
          <Heading as="h3" p={2} sx={{ fontFamily: "body", fontWeight: "500" }}>
            {title}
          </Heading>
          {properties.map((param, i) => {
            return (
              <Box
                p={2}
                sx={{
                  borderTop: "hairline",
                }}
                key={i}
              >
                <Flex
                  sx={{
                    fontSize: "0",
                    alignItems: "baseline",
                    pb: "1",
                    fontFamily: "monospace",
                  }}
                >
                  <Box mr={2} fontSize={"12px"}>
                    {param.property}
                  </Box>
                  <Text color={"gray"} fontSize={"10px"}>
                    {param.type}
                  </Text>
                  {param.required && (
                    <Text ml={1} fontSize={"10px"} variant="labels.required">
                      required
                    </Text>
                  )}
                </Flex>
                <Description>
                  <Text
                    sx={{
                      fontSize: "0",
                      lineHeight: "26px",
                      fontFamily: "body",
                    }}
                  >
                    <Markdown>{param.description}</Markdown>
                  </Text>
                </Description>
              </Box>
            )
          })}
        </Box>
      </Collapsible>
    </Box>
  )
}

export default NestedCollapsible
