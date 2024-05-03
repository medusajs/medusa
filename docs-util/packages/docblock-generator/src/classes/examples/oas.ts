import { faker } from "@faker-js/faker"
import { OpenAPIV3 } from "openapi-types"
import { API_ROUTE_PARAM_REGEX, OasArea } from "../kinds/oas.js"
import { CodeSample } from "../../types/index.js"
import { capitalize, kebabToCamel, wordsToCamel, wordsToKebab } from "utils"

type CodeSampleData = Omit<CodeSample, "source">

/**
 * This class generates examples for OAS.
 */
class OasExamplesGenerator {
  static JSCLIENT_CODESAMPLE_DATA: CodeSampleData = {
    lang: "JavaScript",
    label: "JS Client",
  }
  static CURL_CODESAMPLE_DATA: CodeSampleData = {
    lang: "Shell",
    label: "cURL",
  }
  static MEDUSAREACT_CODESAMPLE_DATA: CodeSampleData = {
    lang: "tsx",
    label: "Medusa React",
  }

  /**
   * Generate JS client example for an OAS operation.
   *
   * @param param0 - The operation's details
   * @returns The JS client example.
   */
  generateJSClientExample({
    area,
    tag,
    oasPath,
    httpMethod,
    isAdminAuthenticated,
    isStoreAuthenticated,
    parameters,
    requestBody,
    responseBody,
  }: {
    /**
     * The area of the operation.
     */
    area: OasArea
    /**
     * The tag this operation belongs to.
     */
    tag: string
    /**
     * The API route's path.
     */
    oasPath: string
    /**
     * The http method of the operation.
     */
    httpMethod: string
    /**
     * Whether the operation requires admin authentication.
     */
    isAdminAuthenticated?: boolean
    /**
     * Whether the operation requires customer authentication.
     */
    isStoreAuthenticated?: boolean
    /**
     * The path parameters that can be sent in the request, if any.
     */
    parameters?: OpenAPIV3.ParameterObject[]
    /**
     * The request body's schema, if any.
     */
    requestBody?: OpenAPIV3.SchemaObject
    /**
     * The response body's schema, if any.
     */
    responseBody?: OpenAPIV3.SchemaObject
  }) {
    const exampleArr = [
      `import Medusa from "@medusajs/medusa-js"`,
      `const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })`,
    ]

    if (isAdminAuthenticated) {
      exampleArr.push(`// must be previously logged in or use api token`)
    } else if (isStoreAuthenticated) {
      exampleArr.push(`// must be previously logged in.`)
    }

    // infer JS method name
    // reset regex manually
    API_ROUTE_PARAM_REGEX.lastIndex = 0
    const isForSingleEntity = API_ROUTE_PARAM_REGEX.test(oasPath)
    let jsMethod = `{methodName}`
    if (isForSingleEntity) {
      const splitOasPath = oasPath
        .replaceAll(API_ROUTE_PARAM_REGEX, "")
        .replace(/\/(batch)*$/, "")
        .split("/")
      const isBulk = oasPath.endsWith("/batch")
      const isOperationOnDifferentEntity =
        wordsToKebab(tag) !== splitOasPath[splitOasPath.length - 1]
      if (isBulk || isOperationOnDifferentEntity) {
        const endingEntityName = capitalize(
          isBulk &&
            API_ROUTE_PARAM_REGEX.test(splitOasPath[splitOasPath.length - 1])
            ? wordsToCamel(tag)
            : kebabToCamel(splitOasPath[splitOasPath.length - 1])
        )

        jsMethod =
          httpMethod === "get"
            ? `list${endingEntityName}`
            : httpMethod === "post"
              ? `add${endingEntityName}`
              : `remove${endingEntityName}`
      } else {
        jsMethod =
          httpMethod === "get"
            ? "retrieve"
            : httpMethod === "post"
              ? "update"
              : "delete"
      }
    } else {
      jsMethod =
        httpMethod === "get"
          ? "list"
          : httpMethod === "post"
            ? "create"
            : "delete"
    }

    // collect the path/request parameters to be passed to the request.
    const parametersArr: string[] =
      parameters?.map((parameter) => parameter.name) || []
    const requestData = requestBody
      ? this.getSchemaRequiredData(requestBody)
      : {}

    // assemble the method-call line of format `medusa.{admin?}.{methodName}({...parameters,} {requestBodyDataObj})`
    exampleArr.push(
      `medusa${area === "admin" ? `.${area}` : ""}.${wordsToCamel(
        tag
      )}.${jsMethod}(${parametersArr.join(", ")}${
        Object.keys(requestData).length
          ? `${parametersArr.length ? ", " : ""}${JSON.stringify(
              requestData,
              undefined,
              2
            )}`
          : ""
      })`
    )

    // assemble then lines with response data, if any
    const responseData = responseBody
      ? this.getSchemaRequiredData(responseBody)
      : {}
    const responseRequiredItems = Object.keys(responseData)
    const responseRequiredItemsStr = responseRequiredItems.length
      ? `{ ${responseRequiredItems.join(", ")} }`
      : ""

    exampleArr.push(
      `.then((${responseRequiredItemsStr}) => {\n\t\t${
        responseRequiredItemsStr.length
          ? `console.log(${responseRequiredItemsStr})`
          : "// Success"
      }\n})`
    )

    return exampleArr.join("\n")
  }

  /**
   * Generate cURL examples for an OAS operation.
   *
   * @param param0 - The operation's details.
   * @returns The cURL example.
   */
  generateCurlExample({
    method,
    path,
    isAdminAuthenticated,
    isStoreAuthenticated,
    requestSchema,
  }: {
    /**
     * The HTTP method.
     */
    method: string
    /**
     * The API Route's path.
     */
    path: string
    /**
     * Whether the route requires admin authentication.
     */
    isAdminAuthenticated?: boolean
    /**
     * Whether the route requires customer authentication.
     */
    isStoreAuthenticated?: boolean
    /**
     * The schema of the request body, if any.
     */
    requestSchema?: OpenAPIV3.SchemaObject
  }): string {
    const exampleArr = [
      `curl${
        method.toLowerCase() !== "get" ? ` -X ${method.toUpperCase()}` : ""
      } '{backend_url}${path}'`,
    ]

    if (isAdminAuthenticated) {
      exampleArr.push(`-H 'x-medusa-access-token: {api_token}'`)
    } else if (isStoreAuthenticated) {
      exampleArr.push(`-H 'Authorization: Bearer {access_token}'`)
    }

    if (requestSchema) {
      const requestData = this.getSchemaRequiredData(requestSchema)

      if (Object.keys(requestData).length > 0) {
        exampleArr.push(`-H 'Content-Type: application/json'`)
        exampleArr.push(
          `--data-raw '${JSON.stringify(requestData, undefined, 2)}'`
        )
      }
    }

    return exampleArr.join(` \\\n`)
  }

  /**
   * Retrieves data object from a schema object. Only retrieves the required fields.
   *
   * @param schema - The schema to retrieve its required data object.
   * @returns An object of required data and their fake values.
   */
  getSchemaRequiredData(
    schema: OpenAPIV3.SchemaObject
  ): Record<string, unknown> {
    const data: Record<string, unknown> = {}

    if (schema.required?.length && schema.properties) {
      schema.required.forEach((propertyName) => {
        // extract property and its type
        const property = schema.properties![
          propertyName
        ] as OpenAPIV3.SchemaObject
        let value: unknown
        if (property.type === "object") {
          const typedValue: Record<string, unknown> = {}
          // get the fake value of every property in the object
          if (property.properties) {
            Object.entries(property.properties).forEach(
              ([childName, childProp]) => {
                const typedChildProp = childProp as OpenAPIV3.SchemaObject
                if (!typedChildProp.type) {
                  return
                }
                // if the property is an object, get its data object
                // otherwise, get its fake value
                typedValue[childName] =
                  typedChildProp.type === "object"
                    ? this.getSchemaRequiredData(
                        typedChildProp as OpenAPIV3.SchemaObject
                      )
                    : this.getFakeValue({
                        name: childName,
                        type: typedChildProp.type,
                        format: typedChildProp.format,
                      })
              }
            )
          }

          value = typedValue
        } else if (property.type === "array") {
          // if the type of the array's items is an object, retrieve
          // its data object. Otherwise, retrieve its fake value.
          const propertyItems = property.items as OpenAPIV3.SchemaObject
          if (!propertyItems.type) {
            value = []
          } else {
            value = [
              propertyItems.type === "object"
                ? this.getSchemaRequiredData(
                    property.items as OpenAPIV3.SchemaObject
                  )
                : this.getFakeValue({
                    name: propertyName,
                    type: propertyItems.type,
                    format: propertyItems.format,
                  }),
            ]
          }
        } else if (property.type) {
          // retrieve fake value for all other types
          value = this.getFakeValue({
            name: propertyName,
            type: property.type,
            format: property.format,
          })
        }

        if (value !== undefined) {
          data[propertyName] = value
        }
      })
    }

    return data
  }

  /**
   * Retrieve the fake value of a property. The value is used in examples.
   *
   * @param param0 - The property's details
   * @returns The fake value
   */
  getFakeValue({
    name,
    type,
    format,
  }: {
    /**
     * The name of the property. It can help when generating the fake value.
     * For example, if the name is `id`, the fake value generated will be of the format `id_<randomstring>`.
     */
    name: string
    /**
     * The type of the property.
     */
    type: OpenAPIV3.NonArraySchemaObjectType | "array"
    /**
     * The OAS format of the property. For example, `date-time`.
     */
    format?: string
  }): unknown {
    let value: unknown

    switch (true) {
      case type === "string" && format === "date-time":
        value = faker.date.future().toISOString()
        break
      case type === "boolean":
        value = faker.datatype.boolean()
        break
      case type === "integer" || type === "number":
        value = faker.number.int()
        break
      case type === "array":
        value = []
        break
      case type === "string":
        value = faker.helpers
          .mustache(`{{${name}}}`, {
            id: () =>
              `id_${faker.string.alphanumeric({
                length: { min: 10, max: 20 },
              })}`,
            name: () => faker.person.firstName(),
            email: () => faker.internet.email(),
            password: () => faker.internet.password({ length: 8 }),
            currency: () => faker.finance.currencyCode(),
          })
          .replace(`{{${name}}}`, "{value}")
    }

    return value !== undefined ? value : "{value}"
  }
}

export default OasExamplesGenerator
