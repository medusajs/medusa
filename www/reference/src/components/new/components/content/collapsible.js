import React, { useState } from "react"
import styled from "@emotion/styled"
import Collapsible from "react-collapsible"
import { Flex, Box, Text, Button } from "rebass"
import Markdown from "react-markdown"
import typography from "../../../typography"

const ExpandContainer = styled.div`
  .child-attrs {
    cursor: pointer;
    font-size: 12px;
    box-sizing: border-box;
    padding: 6px 10px;
    width: max-content;
    border-radius: 16px;
    border: 1px solid var(--faded);

    &:hover {
      color: var(--dark);
    }
  }
  .child-attrs.is-open {
    width: 100%;
    border-bottom: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  margin-top: 12px;
`

const Trigger = styled(Flex)`
  ${typography.Small}
  font-size: 13px;
  font-weight: 400;
`

const Symbol = styled(Box)`
  transition: all 0.2s ease;
  transform: rotate(45deg);
  ${typography.Medium}

  &.rotated {
    transform: rotate(0deg);
  }
`

const NestedCollapsible = ({ properties, title }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <ExpandContainer>
      <Collapsible
        transitionTime={50}
        triggerClassName={"child-attrs"}
        triggerOpenedClassName={"child-attrs"}
        triggerTagName="div"
        trigger={
          <Trigger alignItems="baseline">
            <Symbol mr={1} className={isOpen ? "rotated" : null}>
              &times;
            </Symbol>{" "}
            <Text fontSize={0}>{`${
              isOpen ? "Hide" : "Show"
            } child attributes`}</Text>
          </Trigger>
        }
        onTriggerOpening={() => setIsOpen(true)}
        onTriggerClosing={() => setIsOpen(false)}
      >
        <Box
          sx={{
            padding: "10px",
            borderRadius: "16px",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            border: "hairline",
            borderColor: "var(--faded)",
          }}
          mb="2"
        >
          <Text p={2} fontFamily="body">
            {title}
          </Text>
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
                  fontSize="1"
                  alignItems="baseline"
                  pb={1}
                  fontFamily="monospace"
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
                <Text fontSize={0} lineHeight="26px" fontFamily="body">
                  <Markdown>{param.description}</Markdown>
                </Text>
              </Box>
            )
          })}
        </Box>
      </Collapsible>
    </ExpandContainer>
  )
}

export default NestedCollapsible
