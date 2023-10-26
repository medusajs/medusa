import type { Parameter, SchemaObject } from "@/types/openapi"
import TagOperationParameters from "../../Parameters"

export type TagsOperationDescriptionSectionParametersProps = {
  parameters: Parameter[]
}

const TagsOperationDescriptionSectionParameters = ({
  parameters,
}: TagsOperationDescriptionSectionParametersProps) => {
  const pathParameters: SchemaObject = {
    type: "object",
    required: [],
    properties: {},
  }
  const queryParameters: SchemaObject = {
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
    }
  })

  return (
    <>
      {Object.values(pathParameters.properties).length > 0 && (
        <>
          <h3 className="border-medusa-border-base border-b py-1.5">
            Path Parameters
          </h3>
          <TagOperationParameters
            schemaObject={pathParameters}
            topLevel={true}
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
          />
        </>
      )}
    </>
  )
}

export default TagsOperationDescriptionSectionParameters
