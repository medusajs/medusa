import { Box, Flex, Heading, Text } from "theme-ui"
import React, { useContext, useEffect, useRef } from "react"

import Description from "./description"
import JsonContainer from "./json-container"
import Markdown from "react-markdown"
import NavigationContext from "../../context/navigation-context"
import Parameters from "./parameters"
import ResponsiveContainer from "./responsive-container"
import Route from "./route"
import { convertToKebabCase } from "../../utils/convert-to-kebab-case"
import { formatMethodParams } from "../../utils/format-parameters"
import { formatRoute } from "../../utils/format-route"
import useInView from "../../hooks/use-in-view"

const Method = ({ data, section, sectionData, pathname, api }) => {
  const { parameters, requestBody, description, method, summary } = data
  const jsonResponse = data.responses[0].content?.[0].json
  const { updateHash, updateMetadata } = useContext(NavigationContext)
  const methodRef = useRef(null)
  const [containerRef, isInView] = useInView({
    root: null,
    rootMargin: "0px 0px -80% 0px",
    threshold: 0,
  })
  const formattedParameters = formatMethodParams({ parameters, requestBody })

  useEffect(() => {
    if (isInView) {
      updateHash(section, convertToKebabCase(summary), sectionData)
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

  const getExampleValues = (type, defaultExample) => {
    switch (type) {
      case "integer":
        return 1000
      case "boolean":
        return false
      case "object":
        return {}
      default:
        return defaultExample
    }
  }

  // extract required properties or a non-required property from a json object
  // based on the extraction method "getPropertyFromObject"
  const getPropertiesFromObject = (
    requiredProperties,
    properties,
    obj,
    res,
    getPropertyFromObject
  ) => {
    for (const element of requiredProperties) {
      try {
        res[element.property] = getPropertyFromObject(obj, element.property)
      } catch (err) {}
    }

    // if (Object.keys(res) === requiredProperties.map((p) => p.property)) {
    //   return res
    // }

    for (const element of properties) {
      try {
        res[element.property] = getPropertyFromObject(obj, element.property)
        break
      } catch (err) {}
    }

    return res
  }

  const getCurlJson = (properties, prefix, bodyParameters) => {
    if (!properties[0] || !jsonResponse) {
      return
    }
    const jsonObject = JSON.parse(jsonResponse)
    const pathParts = pathname.split("/")
    const requiredProperties = bodyParameters.filter((p) => p.required)

    let res = {}

    // if the endpoint is for a relation i.e. /orders/:id/shipment drill down into the properties of the json object
    if (pathParts.length > 3) {
      const propertyIndex = pathParts[2].match(/{[A-Za-z_]+}/) ? 3 : 2

      try {
        const obj =
          jsonObject[pathParts[propertyIndex].replace("-", "_")] ||
          jsonObject[Object.keys(jsonObject)[0]][
            pathParts[propertyIndex].replace("-", "_")
          ]

        res = getPropertiesFromObject(
          requiredProperties,
          properties,
          obj,
          res,
          (obj, property) =>
            Array.isArray(obj)
              ? obj.find((o) => o[property])[property]
              : obj[property]
        )
      } catch (err) {}
    }

    // if nothing was found drilling down look at the top level properties
    if (JSON.stringify(res) === "{}") {
      res = getPropertiesFromObject(
        requiredProperties,
        properties,
        jsonObject,
        res,
        (jsonObject, property) =>
          jsonObject[property] ||
          jsonObject[Object.keys(jsonObject)[0]][property]
      )
    }

    // Last resort, set the first property to an example
    if (JSON.stringify(res) === "{}") {
      res[properties[0].property] = getExampleValues(properties[0].type, `${prefix}_${properties[0].property}`)
    }

    // Add values to 'undefined' properties before returning due to JSON.stringify removing 'undefined' but not 'null'
    return requiredProperties.reduce((prev, curr) => {
        if(prev[curr.property] === undefined){
          prev[curr.property] = getExampleValues(curr.type, `${prefix}_${curr.property}`)
        }
        return prev
      }, res)
  }

  const getCurlCommand = (requestBody) => {
    const body = JSON.stringify(
      getCurlJson(
        requestBody.properties,
        `example_${section}`,
        formattedParameters.body
      )
    )
    return `curl -X ${data.method.toUpperCase()} https://medusa-url.com/${api}${formatRoute(
      pathname
    )} \\
  --header "Authorization: Bearer <ACCESS TOKEN>" ${
    data.method.toUpperCase() === "POST" && requestBody.properties?.length > 0
      ? `\\
  --header "content-type: application/json" \\
  --data '${body}'`
      : ""
  }`
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
          <Box mt={2}>
            <Parameters params={formattedParameters} type={"Parameters"} />
          </Box>
        </Flex>
        <Box className="code">
          <Box>
            <JsonContainer
              json={getCurlCommand(requestBody)}
              header={"cURL Example"}
              language={"shell"}
              allowCopy={true}
              method={convertToKebabCase(summary)}
            />
          </Box>
          <Box>
            <JsonContainer
              json={jsonResponse}
              header={"RESPONSE"}
              method={convertToKebabCase(summary)}
            />
          </Box>
        </Box>
      </ResponsiveContainer>
    </Flex>
  )
}

export default Method
