import React, { useContext, useEffect, useRef } from "react"
import Markdown from "react-markdown"
import { Flex, Text, Box, Heading } from "theme-ui"
import { convertToKebabCase } from "../../utils/convert-to-kebab-case"
import Parameters from "./parameters"
import Route from "./route"
import JsonContainer from "./json-container"
import Description from "./description"
import ResponsiveContainer from "./responsive-container"
import { formatMethodParams } from "../../utils/format-parameters"
import useInView from "../../hooks/use-in-view"
import NavigationContext from "../../context/navigation-context"

const Method = ({ data, section, pathname }) => {
  const { parameters, requestBody, description, method, summary } = data
  const jsonResponse = data.responses[0].content?.[0].json
  const { updateHash, updateMetadata } = useContext(NavigationContext)
  const methodRef = useRef(null)

  const [containerRef, isInView] = useInView({
    root: null,
    rootMargin: "0px 0px -80% 0px",
    threshold: 0,
  })

  useEffect(() => {
    if (isInView) {
      updateHash(section, convertToKebabCase(summary))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView])

  const handleMetaChange = () => {
    updateMetadata({
      title: summary,
      description: description,
    })
    if (methodRef.current) {
      methodRef.current.scrollIntoView({
        behavior: "smooth",
      })
    }
  }

  return (
    <Flex
      py={"5vw"}
      sx={{
        borderTop: "hairline",
        flexDirection: "column",
      }}
      id={convertToKebabCase(summary)}
      ref={methodRef}
    >
      <Flex>
        <Heading
          as="h2"
          mb={4}
          sx={{
            fontSize: "4",
            fontWeight: "500",
            cursor: "pointer",
          }}
          ref={containerRef}
          onClick={() => handleMetaChange()}
        >
          {summary}
        </Heading>
      </Flex>
      <ResponsiveContainer>
        <Flex
          className="info"
          sx={{
            flexDirection: "column",
            pr: "5",
            "@media screen and (max-width: 848px)": {
              pr: "0",
            },
          }}
        >
          <Route path={pathname} method={method} />
          <Description>
            <Text
              sx={{
                lineHeight: "26px",
              }}
              mt={3}
            >
              <Markdown>{description}</Markdown>
            </Text>
          </Description>
          <Box mt={4}>
            <Parameters
              params={formatMethodParams({ parameters, requestBody })}
            />
          </Box>
        </Flex>
        <Box className="code">
          <JsonContainer
            json={jsonResponse}
            header={"RESPONSE"}
            method={convertToKebabCase(summary)}
          />
        </Box>
      </ResponsiveContainer>
    </Flex>
  )
}

export default Method
