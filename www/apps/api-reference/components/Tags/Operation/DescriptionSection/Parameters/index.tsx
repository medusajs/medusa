import React from "react"
import type { OpenAPI } from "types"
import TagOperationParameters from "../../Parameters"

export type TagsOperationDescriptionSectionParametersProps = {
  parameters: OpenAPI.Parameter[]
}

const TagsOperationDescriptionSectionParameters = ({
  parameters,
}: TagsOperationDescriptionSectionParametersProps) => {
  const pathParameters: OpenAPI.SchemaObject = {
    type: "object",
    required: [],
    properties: {},
  }
  const queryParameters: OpenAPI.SchemaObject = {
    type: "object",
    required: [],
    properties: {},
  }
  const headerParameters: OpenAPI.SchemaObject = {
    type: "object",
    required: [],
    properties: {},
  }

  parameters.forEach((parameter) => {
    const parameterObject = {
      ...parameter.schema,
      parameterName: parameter.name,
      description: parameter.description,
      example: parameter.example,
      examples: parameter.examples,
    }
    if (parameter.in === "path") {
      if (parameter.required) {
        pathParameters.required?.push(parameter.name)
      }
      pathParameters.properties[parameter.name] = parameterObject
    } else if (parameter.in === "query") {
      if (parameter.required) {
        queryParameters.required?.push(parameter.name)
      }
      queryParameters.properties[parameter.name] = parameterObject
    } else if (parameter.in === "header") {
      if (parameter.required) {
        headerParameters.required?.push(parameter.name)
      }
      headerParameters.properties[parameter.name] = parameterObject
    }
  })

  return (
    <>
      {Object.values(headerParameters.properties).length > 0 && (
        <>
          <h3 className="border-medusa-border-base border-b py-1.5">
            Header Parameters
          </h3>
          <TagOperationParameters
            schemaObject={headerParameters}
            topLevel={true}
            data-testid="header-parameters"
          />
        </>
      )}
      {Object.values(pathParameters.properties).length > 0 && (
        <>
          <h3 className="border-medusa-border-base border-b py-1.5">
            Path Parameters
          </h3>
          <TagOperationParameters
            schemaObject={pathParameters}
            topLevel={true}
            data-testid="path-parameters"
          />
        </>
      )}
      {Object.values(queryParameters.properties).length > 0 && (
        <>
          <h3 className="border-medusa-border-base border-b py-1.5">
            Query Parameters
          </h3>
          <TagOperationParameters
            schemaObject={queryParameters}
            topLevel={true}
            data-testid="query-parameters"
          />
        </>
      )}
    </>
  )
}

export default TagsOperationDescriptionSectionParameters
