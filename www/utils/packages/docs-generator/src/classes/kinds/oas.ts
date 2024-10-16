import { readFileSync, writeFileSync } from "fs"
import { OpenAPIV3 } from "openapi-types"
import { basename, join } from "path"
import ts, { SyntaxKind } from "typescript"
import { capitalize, kebabToTitle } from "utils"
import { parse, stringify } from "yaml"
import { DEFAULT_OAS_RESPONSES, SUMMARY_PLACEHOLDER } from "../../constants.js"
import {
  OpenApiDocument,
  OpenApiOperation,
  OpenApiSchema,
} from "../../types/index.js"
import formatOas from "../../utils/format-oas.js"
import getCorrectZodTypeName from "../../utils/get-correct-zod-type-name.js"
import { getOasOutputBasePath } from "../../utils/get-output-base-paths.js"
import isZodObject from "../../utils/is-zod-object.js"
import parseOas, { ExistingOas } from "../../utils/parse-oas.js"
import OasExamplesGenerator from "../examples/oas.js"
import { GeneratorEvent } from "../helpers/generator-event-manager.js"
import OasSchemaHelper from "../helpers/oas-schema.js"
import SchemaFactory from "../helpers/schema-factory.js"
import { GeneratorOptions, GetDocBlockOptions } from "./default.js"
import FunctionKindGenerator, {
  FunctionNode,
  FunctionOrVariableNode,
  VariableNode,
} from "./function.js"
import { API_ROUTE_PARAM_REGEX } from "../../constants.js"
import TypesHelper from "../helpers/types.js"
import {
  isLevelExceeded,
  maybeIncrementLevel,
} from "../../utils/level-utils.js"

const RES_STATUS_REGEX = /^res[\s\S]*\.status\((\d+)\)/

type SchemaDescriptionOptions = {
  symbol?: ts.Symbol
  node?: ts.Node
  nodeType?: ts.Type
  typeStr: string
  parentName?: string
  rawParentName?: string
}

export type OasArea = "admin" | "store"

type ParameterType = "query" | "path"

type AuthRequests = {
  exact?: string
  startsWith?: string
  requiresAuthentication: boolean
}

/**
 * OAS generator for API routes. It extends the {@link FunctionKindGenerator}
 * since API routes are functions.
 */
class OasKindGenerator extends FunctionKindGenerator {
  public name = "oas"
  protected allowedKinds: SyntaxKind[] = [ts.SyntaxKind.FunctionDeclaration]
  private MAX_LEVEL = 7
  readonly REQUEST_TYPE_NAMES = [
    "MedusaRequest",
    "RequestWithContext",
    "AuthenticatedMedusaRequest",
  ]
  // as it's not always possible to detect authenticated request
  // use this to override the default detection logic.
  readonly AUTH_REQUESTS: AuthRequests[] = [
    {
      exact: "store/orders",
      requiresAuthentication: true,
    },
    {
      startsWith: "store/customers",
      requiresAuthentication: true,
    },
  ]
  readonly RESPONSE_TYPE_NAMES = ["MedusaResponse"]
  readonly FIELD_QUERY_PARAMS = ["fields", "expand"]
  readonly PAGINATION_QUERY_PARAMS = ["limit", "offset", "order"]

  /**
   * This map collects tags of all the generated OAS, then, once the generation process finishes,
   * it checks if it should be added to the base OAS document of the associated area.
   */
  private tags: Map<OasArea, Set<string>>
  /**
   * The path to the directory holding the base YAML files.
   */
  protected baseOutputPath: string
  protected oasExamplesGenerator: OasExamplesGenerator
  protected oasSchemaHelper: OasSchemaHelper
  protected schemaFactory: SchemaFactory
  protected typesHelper: TypesHelper

  constructor(options: GeneratorOptions) {
    super(options)

    this.oasExamplesGenerator = new OasExamplesGenerator()
    this.baseOutputPath = getOasOutputBasePath()

    this.tags = new Map()
    this.oasSchemaHelper = new OasSchemaHelper()
    this.schemaFactory = new SchemaFactory()
    this.typesHelper = new TypesHelper({
      checker: this.checker,
    })
    this.init()

    this.generatorEventManager.listen(
      GeneratorEvent.FINISHED_GENERATE_EVENT,
      this.afterGenerate.bind(this)
    )
  }

  /**
   * Check whether the generator can be used for the specified node. The node must be a function that has
   * two parameters of types in {@link REQUEST_TYPE_NAMES} and {@link RESPONSE_TYPE_NAMES}
   *
   * @param node - The node to check.
   * @returns Whether the generator can be used for the specified node.
   */
  isAllowed(node: ts.Node): node is FunctionOrVariableNode {
    const isFunction =
      this.allowedKinds.includes(node.kind) ||
      (ts.isVariableStatement(node) && this.isFunctionVariable(node))

    if (!isFunction) {
      return false
    }

    const functionNode = ts.isFunctionDeclaration(node)
      ? node
      : this.extractFunctionNode(node as VariableNode)

    if (!functionNode || functionNode.parameters.length !== 2) {
      return false
    }

    const hasCorrectRequestType = this.REQUEST_TYPE_NAMES.some(
      (name) => functionNode.parameters[0].type?.getText().startsWith(name)
    )
    const hasCorrectResponseType = this.RESPONSE_TYPE_NAMES.some(
      (name) => functionNode.parameters[1].type?.getText().startsWith(name)
    )

    return hasCorrectRequestType && hasCorrectResponseType
  }

  /**
   * Check whether the node can be documented.
   *
   * @param node - The node to check.
   * @returns Whether the node can be documented.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canDocumentNode(node: ts.Node): boolean {
    // unlike other generators, this one
    // can update existing OAS, so we just return
    // true
    return true
  }

  /**
   * Try to retrieve the OAS previously generated for the function. If the OAS is retrieved, the
   * OAS is updated rather than created.
   *
   * @param node - The node to retrieve its existing OAS.
   * @returns The node's existing OAS, if available.
   */
  getExistingOas(node: FunctionOrVariableNode): ExistingOas | undefined {
    // read the file holding the OAS, if it's available.
    const fileContent = ts.sys.readFile(this.getAssociatedFileName(node))

    if (!fileContent) {
      // the file doesn't exist, meaning there's no existing OAS.
      return
    }

    return parseOas(fileContent)
  }

  /**
   * Retrieves the docblock of the node. If the node has existing OAS, the OAS is updated and returned. Otherwise,
   * the OAS is generated.
   *
   * @param node - The node to get its OAS.
   * @param options - The options to get the OAS.
   * @returns The OAS as a string that can be used as a comment in a TypeScript file.
   */
  async getDocBlock(
    node: ts.Node | FunctionOrVariableNode,
    options?: GetDocBlockOptions
  ): Promise<string> {
    // TODO use AiGenerator to generate descriptions + examples
    if (!this.isAllowed(node)) {
      return await super.getDocBlock(node, options)
    }

    const actualNode = ts.isVariableStatement(node)
      ? this.extractFunctionNode(node)
      : node

    if (!actualNode) {
      return await super.getDocBlock(node, options)
    }
    const methodName = this.getHTTPMethodName(node)

    const existingOas = this.getExistingOas(node)

    if (existingOas?.oas) {
      return this.updateExistingOas({
        node: actualNode,
        methodName,
        oasOptions: existingOas,
      })
    }

    return this.getNewOasDocBlock({
      node: actualNode,
      methodName,
    })
  }

  /**
   * Generate OAS of a node.
   *
   * @param param0 - The node's details.
   * @returns The OAS comment.
   */
  getNewOasDocBlock({
    node,
    methodName,
  }: {
    /**
     * The node to generate its OAS.
     */
    node: FunctionNode
    /**
     * The lowercase name of the method. For example, `get`.
     */
    methodName: string
  }): string {
    // collect necessary variables
    const { oasPath, normalized: normalizedOasPath } = this.getOasPath(node)
    const splitOasPath = oasPath.split("/")
    const oasPrefix = this.getOasPrefix(methodName, normalizedOasPath)
    const { isAdminAuthenticated, isStoreAuthenticated, isAuthenticated } =
      this.getAuthenticationDetails(node, oasPath)
    const tagName = this.getTagName(splitOasPath)
    const { summary, description } =
      this.knowledgeBaseFactory.tryToGetOasMethodSummaryAndDescription({
        oasPath,
        httpMethod: methodName,
        tag: tagName || "",
      })

    // construct oas
    const oas: OpenApiOperation = {
      operationId: this.getOperationId({
        methodName,
        splitOasPath,
      }),
      summary,
      description,
      "x-authenticated": isAuthenticated,
      parameters: this.getPathParameters({ oasPath, tagName }),
      security: [],
    }

    // retreive query and request parameters
    const { queryParameters, requestSchema } = this.getRequestParameters({
      node,
      tagName,
      methodName,
    })

    oas.parameters?.push(...queryParameters)
    if (requestSchema && Object.keys(requestSchema).length > 0) {
      oas.requestBody = {
        content: {
          "application/json": {
            schema:
              this.oasSchemaHelper.namedSchemaToReference(requestSchema) ||
              this.oasSchemaHelper.schemaChildrenToRefs(requestSchema),
          },
        },
      }
    }

    // retrieve response schema
    const responseSchema = this.getResponseSchema({
      node,
      tagName,
    })

    // retrieve code examples
    // only generate cURL examples, and for the rest
    // check if the --generate-examples option is enabled
    oas["x-codeSamples"] = [
      {
        ...OasExamplesGenerator.CURL_CODESAMPLE_DATA,
        source: this.oasExamplesGenerator.generateCurlExample({
          method: methodName,
          path: normalizedOasPath,
          isAdminAuthenticated,
          isStoreAuthenticated,
          requestSchema,
        }),
      },
    ]

    if (this.options.generateExamples) {
      oas["x-codeSamples"].push(
        {
          ...OasExamplesGenerator.JSCLIENT_CODESAMPLE_DATA,
          source: this.oasExamplesGenerator.generateJSClientExample({
            oasPath,
            httpMethod: methodName,
            area: splitOasPath[0] as OasArea,
            tag: tagName || "",
            isAdminAuthenticated,
            isStoreAuthenticated,
            parameters: (oas.parameters as OpenAPIV3.ParameterObject[])?.filter(
              (parameter) => parameter.in === "path"
            ),
            requestBody: requestSchema,
            responseBody: responseSchema,
          }),
        },
        {
          ...OasExamplesGenerator.MEDUSAREACT_CODESAMPLE_DATA,
          source: "EXAMPLE", // TODO figure out if we can generate examples for medusa react
        }
      )
    }

    // add security details if applicable
    oas.security = this.getSecurity({ isAdminAuthenticated, isAuthenticated })

    if (tagName) {
      oas.tags = [tagName]
    }

    // detect returned response status
    const responseStatus = this.getResponseStatus(node)

    // add responses
    oas.responses = {
      [responseStatus]: {
        description: "OK",
      },
    }

    if (responseSchema && Object.keys(responseSchema).length > 0) {
      ;(oas.responses[responseStatus] as OpenAPIV3.ResponseObject).content = {
        "application/json": {
          schema:
            this.oasSchemaHelper.namedSchemaToReference(responseSchema) ||
            this.oasSchemaHelper.schemaChildrenToRefs(responseSchema),
        },
      }
    }

    oas.responses = {
      ...(oas.responses || {}),
      ...DEFAULT_OAS_RESPONSES,
    }

    // push new tag to the tags property
    if (tagName) {
      const areaTags = this.tags.get(splitOasPath[0] as OasArea)
      areaTags?.add(tagName)
    }

    // get associated workflow
    oas["x-workflow"] = this.getAssociatedWorkflow(node)

    return formatOas(oas, oasPrefix)
  }

  /**
   * Update an existing OAS operation.
   *
   * @param param0 - The OAS's details.
   * @returns The updated OAS
   */
  updateExistingOas({
    node,
    methodName,
    oasOptions: { oas, oasPrefix },
  }: {
    /**
     * The node that the OAS is associated with.
     */
    node: FunctionNode
    /**
     * The lower case method name of the operation.
     */
    methodName: string
    /**
     * The existing OAS's details.
     */
    oasOptions: ExistingOas
  }): string {
    // collect necessary variables
    const { oasPath, normalized: normalizedOasPath } = this.getOasPath(node)
    const splitOasPath = oasPath.split("/")
    const tagName = this.getTagName(splitOasPath)

    // update tag name
    oas.tags = tagName ? [tagName] : []

    // check if the prefix line should be updated.
    const updatedOasPrefix = this.getOasPrefix(methodName, normalizedOasPath)
    if (updatedOasPrefix !== oasPrefix) {
      oasPrefix = updatedOasPrefix
    }

    // check if operation ID should be updated
    const updatedOperationId = this.getOperationId({
      methodName,
      splitOasPath,
    })

    if (updatedOperationId !== oas.operationId) {
      oas.operationId = updatedOperationId
    }

    // update summary and description either if they're empty or default summary
    const shouldUpdateSummary =
      !oas.summary || oas.summary === SUMMARY_PLACEHOLDER
    const shouldUpdateDescription =
      !oas.description || oas.description === SUMMARY_PLACEHOLDER
    if (shouldUpdateSummary || shouldUpdateDescription) {
      const { summary, description } =
        this.knowledgeBaseFactory.tryToGetOasMethodSummaryAndDescription({
          oasPath,
          httpMethod: methodName,
          tag: tagName || "",
        })

      if (shouldUpdateSummary) {
        oas.summary = summary
      }

      if (shouldUpdateDescription) {
        oas.description = description
      }
    }

    // check if authentication details (including security) should be updated
    const { isAdminAuthenticated, isStoreAuthenticated, isAuthenticated } =
      this.getAuthenticationDetails(node, oasPath)

    oas["x-authenticated"] = isAuthenticated
    oas.security = this.getSecurity({ isAdminAuthenticated, isAuthenticated })

    // update path parameters
    const newPathParameters = this.getPathParameters({ oasPath, tagName })
    oas.parameters = this.updateParameters({
      oldParameters: oas.parameters as OpenAPIV3.ParameterObject[],
      newParameters: newPathParameters,
      type: "path",
    })

    // retrieve updated query and request schemas
    const { queryParameters, requestSchema } = this.getRequestParameters({
      node,
      tagName,
      methodName,
      forUpdate: true,
    })

    // update query parameters
    oas.parameters = this.updateParameters({
      oldParameters: oas.parameters as OpenAPIV3.ParameterObject[],
      newParameters: queryParameters,
      type: "query",
    })

    if (!oas.parameters.length) {
      oas.parameters = undefined
    }

    // update request schema
    const existingRequestBodySchema = (
      oas.requestBody as OpenAPIV3.RequestBodyObject
    )?.content?.["application/json"].schema as OpenApiSchema
    const updatedRequestSchema = this.updateSchema({
      oldSchema: existingRequestBodySchema,
      newSchema: requestSchema,
    })

    if (
      !updatedRequestSchema ||
      Object.keys(updatedRequestSchema).length === 0
    ) {
      // if there's no request schema, remove it from the OAS
      delete oas.requestBody
    } else {
      // update the schema
      oas.requestBody = {
        content: {
          "application/json": {
            schema:
              this.oasSchemaHelper.namedSchemaToReference(
                updatedRequestSchema
              ) ||
              this.oasSchemaHelper.schemaChildrenToRefs(updatedRequestSchema),
          },
        },
      }
    }

    // update response schema and status
    const newStatus = this.getResponseStatus(node)
    const newResponseSchema = this.getResponseSchema({
      node,
      tagName,
      forUpdate: true,
    })
    let updatedResponseSchema: OpenApiSchema | undefined

    if (!oas.responses && newResponseSchema) {
      // add response schema
      oas.responses = {
        [newStatus]: {
          description: "OK",
          content: {
            "application/json": {
              schema:
                this.oasSchemaHelper.namedSchemaToReference(
                  newResponseSchema
                ) ||
                this.oasSchemaHelper.schemaChildrenToRefs(newResponseSchema),
            },
          },
        },
        ...DEFAULT_OAS_RESPONSES,
      }
      updatedResponseSchema = newResponseSchema
    } else if (oas.responses && !newResponseSchema) {
      // check if it has a success response of a type other than JSON
      if (!this.hasResponseType(node, oas)) {
        // remove response schema by only keeping the default responses
        oas.responses = DEFAULT_OAS_RESPONSES
      }
    } else {
      // check if response status should be changed
      const oldResponseStatus = Object.keys(oas.responses!).find(
        (status) => !Object.keys(DEFAULT_OAS_RESPONSES).includes(status)
      )
      const oldResponseSchema = oldResponseStatus
        ? ((oas.responses![oldResponseStatus] as OpenAPIV3.ResponseObject)
            .content?.["application/json"].schema as OpenApiSchema)
        : undefined

      updatedResponseSchema = this.updateSchema({
        oldSchema: oldResponseSchema,
        newSchema: newResponseSchema,
      })

      if (oldResponseStatus && oldResponseSchema !== newStatus) {
        // delete the old response schema if its status is different
        delete oas.responses![oldResponseStatus]
      }

      if (updatedResponseSchema && Object.keys(updatedResponseSchema).length) {
        // update the response schema
        oas.responses![newStatus] = {
          description: "OK",
          content: {
            "application/json": {
              schema: updatedResponseSchema
                ? this.oasSchemaHelper.namedSchemaToReference(
                    updatedResponseSchema
                  ) ||
                  this.oasSchemaHelper.schemaChildrenToRefs(
                    updatedResponseSchema
                  )
                : updatedResponseSchema,
            },
          },
        }
      } else if (oldResponseStatus) {
        // delete the old response schema
        delete oas.responses![oldResponseStatus]
      }
    }

    // update examples if the --generate-examples option is enabled
    if (this.options.generateExamples) {
      const oldJsExampleIndex = oas["x-codeSamples"]
        ? oas["x-codeSamples"].findIndex(
            (example) =>
              example.label ==
              OasExamplesGenerator.JSCLIENT_CODESAMPLE_DATA.label
          )
        : -1

      if (oldJsExampleIndex === -1) {
        // only generate a new example if it doesn't have an example
        const newJsExample = this.oasExamplesGenerator.generateJSClientExample({
          oasPath,
          httpMethod: methodName,
          area: splitOasPath[0] as OasArea,
          tag: tagName || "",
          isAdminAuthenticated,
          isStoreAuthenticated,
          parameters: (oas.parameters as OpenAPIV3.ParameterObject[])?.filter(
            (parameter) => parameter.in === "path"
          ),
          requestBody: updatedRequestSchema,
          responseBody: updatedResponseSchema,
        })

        oas["x-codeSamples"] = [
          ...(oas["x-codeSamples"] || []),
          {
            ...OasExamplesGenerator.JSCLIENT_CODESAMPLE_DATA,
            source: newJsExample,
          },
        ]
      }

      // TODO add for Medusa React once we figure out how to generate it
    }

    // check if cURL example should be updated.
    const oldCurlExampleIndex = oas["x-codeSamples"]
      ? oas["x-codeSamples"].findIndex(
          (example) =>
            example.label === OasExamplesGenerator.CURL_CODESAMPLE_DATA.label
        )
      : -1

    if (oldCurlExampleIndex === -1) {
      // only generate example if it doesn't already exist
      const newCurlExample = this.oasExamplesGenerator.generateCurlExample({
        method: methodName,
        path: normalizedOasPath,
        isAdminAuthenticated,
        isStoreAuthenticated,
        requestSchema,
      })
      oas["x-codeSamples"] = [
        ...(oas["x-codeSamples"] || []),
        {
          ...OasExamplesGenerator.CURL_CODESAMPLE_DATA,
          source: newCurlExample,
        },
      ]
    }

    // push new tags to the tags property
    if (tagName) {
      const areaTags = this.tags.get(splitOasPath[0] as OasArea)
      areaTags?.add(tagName)
    }

    // get associated workflow
    oas["x-workflow"] = this.getAssociatedWorkflow(node)

    return formatOas(oas, oasPrefix)
  }

  /**
   * Get the API route's path details.
   *
   * @param node - The node to retrieve its path details.
   * @returns The path details.
   */
  getOasPath(node: FunctionOrVariableNode): {
    /**
     * The path, generally left as-is, which helps detecting path parameters.
     */
    oasPath: string
    /**
     * The normalized path which adds a backslash at the beginning of the
     * oasPath and replaces path parameters of pattern `[paramName]` with
     * `{paramName}`. This can be used in the prefix line of the OAS.
     */
    normalized: string
  } {
    const filePath = node.getSourceFile().fileName
    const oasPath = filePath
      .substring(filePath.indexOf("/api/"))
      .replace(/^\/api\//, "")
      .replace(`/${basename(filePath)}`, "")
    const normalizedOasPath = `/${oasPath.replaceAll(
      API_ROUTE_PARAM_REGEX,
      `{$1}`
    )}`

    return {
      oasPath,
      normalized: normalizedOasPath,
    }
  }

  /**
   * Get the function's name, which is used to retrieve the HTTP method.
   *
   * @param node - The node to retrieve its function name.
   * @returns the name of the function.
   */
  getFunctionName(node: FunctionOrVariableNode): string {
    if (ts.isFunctionDeclaration(node)) {
      return node.name?.getText() || ""
    }

    return (
      node as ts.VariableStatement
    ).declarationList.declarations[0].name.getText()
  }

  /**
   * Retrieve the HTTP method of a node.
   *
   * @param node - The node to retrieve its HTTP method.
   * @returns The lowercase HTTP method name.
   */
  getHTTPMethodName(node: FunctionOrVariableNode): string {
    return this.getFunctionName(node).toLowerCase()
  }

  /**
   * Retrieve the OAS prefix line that's added before the YAML schema.
   *
   * @param methodName - The HTTP method name.
   * @param oasPath - The API route's path
   * @returns The OAS prefix line.
   */
  getOasPrefix(methodName: string, oasPath: string): string {
    return `@oas [${methodName}] ${oasPath}`
  }

  /**
   * Retrieve the tag name from the split OAS path.
   *
   * @param splitOasPath - The split OAS path.
   * @returns The tag name if available.
   */
  getTagName(splitOasPath: string[]): string | undefined {
    return splitOasPath.length >= 2 ? kebabToTitle(splitOasPath[1]) : undefined
  }

  /**
   * Retrieve the authentication details of a node.
   *
   * @param node - The node to retrieve its authentication details.
   * @param oasPath - The OAS path of the node.
   * @returns The authentication details.
   */
  getAuthenticationDetails(
    node: FunctionNode,
    oasPath: string
  ): {
    /**
     * Whether the OAS operation requires admin authentication.
     */
    isAdminAuthenticated: boolean
    /**
     * Whether the OAS operation requires customer authentication.
     */
    isStoreAuthenticated: boolean
    /**
     * Whether the OAS operation requires authentication in genral.
     */
    isAuthenticated: boolean
  } {
    const isAuthenticationDisabled = node
      .getSourceFile()
      .statements.some((statement) =>
        statement.getText().includes("AUTHENTICATE = false")
      )
    const hasAuthenticationOverride =
      this.AUTH_REQUESTS.find((authRequest) => {
        return (
          authRequest.exact === oasPath ||
          (authRequest.startsWith && oasPath.startsWith(authRequest.startsWith))
        )
      })?.requiresAuthentication === true
    const isAdminAuthenticated =
      (!isAuthenticationDisabled || hasAuthenticationOverride) &&
      oasPath.startsWith("admin")
    const isStoreAuthenticated = hasAuthenticationOverride
      ? oasPath.startsWith("store")
      : !isAuthenticationDisabled &&
        hasAuthenticationOverride &&
        oasPath.startsWith("store")
    const isAuthenticated =
      isAdminAuthenticated || isStoreAuthenticated || hasAuthenticationOverride

    return {
      isAdminAuthenticated,
      isStoreAuthenticated,
      isAuthenticated,
    }
  }

  /**
   * Retrieve the OAS operation's ID.
   *
   * @param param0 - The OAS operation's details.
   * @returns The operation's ID.
   */
  getOperationId({
    methodName,
    splitOasPath,
  }: {
    /**
     * The HTTP method's name.
     */
    methodName: string
    /**
     * The split OAS path.
     */
    splitOasPath: string[]
  }): string {
    let str = capitalize(methodName)
    splitOasPath.slice(1).forEach((item) => {
      if (API_ROUTE_PARAM_REGEX.test(item)) {
        item = item.replace(API_ROUTE_PARAM_REGEX, "$1")
      }

      str += item
        .split("-")
        .map((subitem) => capitalize(subitem))
        .join("")
    })

    return str
  }

  /**
   * Retrieve the security details of an OAS operation.
   *
   * @param param0 - The authentication details.
   * @returns The security details.
   */
  getSecurity({
    isAdminAuthenticated,
    isAuthenticated,
  }: {
    /**
     * Whether the operation requires admin authentication.
     */
    isAdminAuthenticated: boolean
    /**
     * Whether the operation requires general authentication.
     */
    isAuthenticated: boolean
  }): OpenAPIV3.SecurityRequirementObject[] | undefined {
    const security: OpenAPIV3.SecurityRequirementObject[] = []
    if (isAdminAuthenticated) {
      security.push({
        api_token: [],
      })
    }
    if (isAuthenticated) {
      security.push(
        {
          cookie_auth: [],
        },
        {
          jwt_token: [],
        }
      )
    }

    return security.length ? security : undefined
  }

  /**
   * Format a schema as a parameter object. Can be used for path or query parameters.
   *
   * @param param0 - The operation's details.
   * @returns The parameter object.
   */
  getParameterObject({
    type,
    name,
    description,
    required,
    schema,
  }: {
    /**
     * The parameter type.
     */
    type: "path" | "query"
    /**
     * The name of the parameter.
     */
    name: string
    /**
     * Whether the parameter is required.
     */
    required: boolean
    /**
     * The parameter's description.
     */
    description?: string
    /**
     * The parameter's schema.
     */
    schema: OpenApiSchema
  }): OpenAPIV3.ParameterObject {
    return {
      name: name,
      in: type,
      description: description,
      required: required,
      schema: schema,
    }
  }

  /**
   * Retrieve the path parameters.
   *
   * @param param0 - The OAS operation's details.
   * @returns The list of path parameters.
   */
  getPathParameters({
    oasPath,
    tagName,
  }: {
    /**
     * The OAS path.
     */
    oasPath: string
    /**
     * The tag name.
     */
    tagName?: string
  }): OpenAPIV3.ParameterObject[] {
    // reset regex manually
    API_ROUTE_PARAM_REGEX.lastIndex = 0
    let pathParameters: string[] | undefined
    const parameters: OpenAPIV3.ParameterObject[] = []
    while (
      (pathParameters = API_ROUTE_PARAM_REGEX.exec(oasPath)?.slice(1)) !==
      undefined
    ) {
      if (pathParameters.length) {
        pathParameters.forEach((parameter) =>
          parameters.push(
            this.getParameterObject({
              type: "path",
              name: parameter,
              description: this.getSchemaDescription({
                typeStr: parameter,
                parentName: tagName,
              }),
              required: true,
              schema: {
                type: "string",
              },
            })
          )
        )
      }
    }

    return parameters
  }

  /**
   * Retrieve the request query parameters and body schema.
   *
   * @param param0 - The operation's details.
   * @returns The request query parameters and body schema.
   */
  getRequestParameters({
    node,
    tagName,
    methodName,
    forUpdate = false,
  }: {
    /**
     * The node to retrieve its request parameters.
     */
    node: FunctionNode
    /**
     * The HTTP method name of the function.
     */
    methodName: string
    /**
     * The tag's name.
     */
    tagName?: string
    /**
     * Whether the request parameters are retrieved for update purposes only.
     */
    forUpdate?: boolean
  }): {
    /**
     * The query parameters.
     */
    queryParameters: OpenAPIV3.ParameterObject[]
    /**
     * The request schema.
     */
    requestSchema?: OpenApiSchema
  } {
    const parameters: OpenAPIV3.ParameterObject[] = []
    let requestSchema: OpenApiSchema | undefined

    if (
      node.parameters[0].type &&
      ts.isTypeReferenceNode(node.parameters[0].type)
    ) {
      const requestType = this.checker.getTypeFromTypeNode(
        node.parameters[0].type
      ) as ts.TypeReference
      // TODO for now I'll use the type for validatedQuery until
      // we have an actual approach to infer query types
      const querySymbol = requestType.getProperty("validatedQuery")
      if (querySymbol) {
        const { shouldAddFields, shouldAddPagination } =
          this.shouldAddQueryParams(node)
        const queryType = this.checker.getTypeOfSymbol(querySymbol)
        const queryTypeName = this.checker.typeToString(queryType)
        queryType.getProperties().forEach((property) => {
          const propertyName = property.getName()
          // if this is a field / pagination query parameter and
          // they're not used in the route, don't add them.
          if (
            (this.FIELD_QUERY_PARAMS.includes(propertyName) &&
              !shouldAddFields) ||
            (this.PAGINATION_QUERY_PARAMS.includes(propertyName) &&
              !shouldAddPagination)
          ) {
            return
          }
          const propertyType = this.checker.getTypeOfSymbol(property)
          const descriptionOptions: SchemaDescriptionOptions = {
            typeStr: propertyName,
            parentName: tagName,
            rawParentName: queryTypeName,
            node: property.valueDeclaration,
            symbol: property,
            nodeType: propertyType,
          }
          parameters.push(
            this.getParameterObject({
              name: propertyName,
              type: "query",
              description: this.getSchemaDescription(descriptionOptions),
              required: this.isRequired(property),
              schema: this.typeToSchema({
                itemType: propertyType,
                title: propertyName,
                descriptionOptions,
                context: "query",
                saveSchema: !forUpdate,
              }),
            })
          )
        })
      }

      const requestTypeArguments =
        requestType.typeArguments || requestType.aliasTypeArguments

      if (requestTypeArguments?.length === 1) {
        const zodObjectTypeName = getCorrectZodTypeName({
          typeReferenceNode: node.parameters[0].type,
          itemType: requestTypeArguments[0],
        })
        const isQuery = methodName === "get"
        const parameterSchema = this.typeToSchema({
          itemType: requestTypeArguments[0],
          descriptionOptions: {
            parentName: tagName,
            rawParentName: this.checker.typeToString(requestTypeArguments[0]),
          },
          zodObjectTypeName: zodObjectTypeName,
          context: isQuery ? "query" : "request",
          saveSchema: !forUpdate,
        })

        // If function is a GET function, add the type parameter to the
        // query parameters instead of request parameters.
        if (isQuery) {
          if (parameterSchema.type === "object" && parameterSchema.properties) {
            Object.entries(parameterSchema.properties).forEach(
              ([key, propertySchema]) => {
                if ("$ref" in propertySchema) {
                  return
                }

                // check if parameter is already added
                const isAdded = parameters.some((param) => param.name === key)

                if (isAdded) {
                  return
                }

                parameters.push(
                  this.getParameterObject({
                    name: key,
                    type: "query",
                    description: propertySchema.description,
                    required: parameterSchema.required?.includes(key) || false,
                    schema: propertySchema,
                  })
                )
              }
            )
          }
        } else if (methodName !== "delete") {
          requestSchema = parameterSchema
        }
      }
    }

    return {
      queryParameters: parameters,
      requestSchema,
    }
  }

  /**
   * Retrieve the response's status.
   *
   * @param node - The node to retrieve its response status.
   * @returns The response's status.
   */
  getResponseStatus(node: FunctionNode): string {
    let responseStatus = "200"
    if ("body" in node && node.body && "statements" in node.body) {
      node.body.statements.forEach((statement) => {
        const matched = RES_STATUS_REGEX.exec(statement.getText())?.splice(1)
        if (matched?.length === 1) {
          responseStatus = matched[0]
        }
      })
    }

    return responseStatus
  }

  /**
   * Retrieve the response schema of the OAS operation.
   *
   * @param param0 - The OAS operation's details.
   * @returns The response schema.
   */
  getResponseSchema({
    node,
    tagName,
    forUpdate = false,
  }: {
    /**
     * The node to retrieve its response schema.
     */
    node: FunctionNode
    /**
     * The tag's name.
     */
    tagName?: string
    /**
     * Whether the response schema is retrieved for update only.
     */
    forUpdate?: boolean
  }): OpenApiSchema | undefined {
    let responseSchema: OpenApiSchema | undefined

    if (
      node.parameters[1].type &&
      ts.isTypeReferenceNode(node.parameters[1].type)
    ) {
      const responseType = this.checker.getTypeFromTypeNode(
        node.parameters[1].type
      ) as ts.TypeReference
      const responseTypeArguments =
        responseType.aliasTypeArguments ||
        this.checker.getTypeArguments(responseType)

      if (responseTypeArguments.length === 1) {
        responseSchema = this.typeToSchema({
          itemType: responseTypeArguments[0],
          descriptionOptions: {
            parentName: tagName,
            rawParentName: this.checker.typeToString(responseTypeArguments[0]),
          },
          zodObjectTypeName: getCorrectZodTypeName({
            typeReferenceNode: node.parameters[1].type,
            itemType: responseTypeArguments[0],
          }),
          context: "response",
          saveSchema: !forUpdate,
        })
      }
    }

    return responseSchema
  }

  /**
   * Convert a TypeScript type to a schema object.
   *
   * @param param0 - The type and additional details.
   * @returns The schema object.
   */
  typeToSchema({
    itemType,
    level = 1,
    title,
    descriptionOptions,
    allowedChildren,
    disallowedChildren,
    zodObjectTypeName,
    saveSchema = true,
    ...rest
  }: {
    /**
     * The TypeScript type.
     */
    itemType: ts.Type
    /**
     * The current level. Used to limit the recursive loop.
     */
    level?: number
    /**
     * The type's title, if available.
     */
    title?: string
    /**
     * options to retrieve a parameter/property's description.
     */
    descriptionOptions?: Partial<SchemaDescriptionOptions>
    /**
     * Children that can be allowed to retrieve. If this property is supplied,
     * only children in this array are added to the returned schema.
     */
    allowedChildren?: string[]
    /**
     * Children that aren't allowed to retrieve. If this property is supplied,
     * only children not included in this array are added to the schema.
     */
    disallowedChildren?: string[]
    /**
     * By default, the type name is generated from itemType, which
     * doesn't work for types created by Zod. This allows to correct the
     * generated type name.
     */
    zodObjectTypeName?: string
    /**
     * Whether the type is in a request / response
     */
    context?: "request" | "response" | "query"
    /**
     * Whether to save object schemas. Useful when only getting schemas to update.
     */
    saveSchema?: boolean
  }): OpenApiSchema {
    if (isLevelExceeded(level, this.MAX_LEVEL)) {
      return {}
    }

    const symbol = itemType.aliasSymbol || itemType.symbol
    const description = descriptionOptions?.typeStr
      ? this.getSchemaDescription(
          descriptionOptions as SchemaDescriptionOptions
        )
      : title
        ? this.getSchemaDescription({ typeStr: title, nodeType: itemType })
        : SUMMARY_PLACEHOLDER
    const typeAsString =
      zodObjectTypeName || this.checker.typeToString(itemType)

    const schemaFromFactory = this.schemaFactory.tryGetSchema(
      itemType.symbol?.getName() ||
        itemType.aliasSymbol?.getName() ||
        title ||
        typeAsString,
      {
        title: title || typeAsString,
        description,
      },
      rest.context
    )

    if (schemaFromFactory) {
      return schemaFromFactory
    }

    const isEnum = itemType.flags === ts.TypeFlags.Enum
    const isEnumParent =
      itemType.symbol &&
      "parent" in itemType.symbol &&
      (itemType.symbol.parent as ts.Symbol)?.valueDeclaration?.kind ===
        ts.SyntaxKind.EnumDeclaration

    switch (true) {
      case isEnum || isEnumParent:
        const enumMembers: string[] = []
        if (isEnum) {
          symbol?.members?.forEach((enumMember) => {
            if ((enumMember.valueDeclaration as ts.EnumMember).initializer) {
              enumMembers.push(
                (
                  enumMember.valueDeclaration as ts.EnumMember
                ).initializer!.getText()
              )
            }
          })
        } else {
          // the item itself is the enum member so add it to the array
          enumMembers.push(itemType.symbol.getName())
        }
        return {
          type: "string",
          description,
          enum: enumMembers,
        }
      case itemType.isLiteral() || typeAsString === "RegExp":
        const isString =
          itemType.flags === ts.TypeFlags.StringLiteral ||
          typeAsString === "RegExp"
        return {
          type: isString
            ? "string"
            : itemType.flags === ts.TypeFlags.NumberLiteral
              ? "number"
              : "boolean",
          title: title || typeAsString,
          description,
          format: this.getSchemaTypeFormat({
            typeName: typeAsString,
            name: title,
          }),
        }
      case itemType.flags === ts.TypeFlags.String ||
        itemType.flags === ts.TypeFlags.Number ||
        itemType.flags === ts.TypeFlags.Boolean ||
        typeAsString === "Date":
        return {
          type:
            typeAsString === "Date"
              ? "string"
              : (typeAsString as OpenAPIV3.NonArraySchemaObjectType),
          title: title || typeAsString,
          description,
          default: symbol?.valueDeclaration
            ? this.getDefaultValue(symbol?.valueDeclaration)
            : undefined,
          format: this.getSchemaTypeFormat({
            typeName: typeAsString,
            name: title,
          }),
        }
      case ("intrinsicName" in itemType &&
        itemType.intrinsicName === "boolean") ||
        itemType.flags === ts.TypeFlags.BooleanLiteral:
        return {
          type: "boolean",
          title: title || typeAsString,
          description,
          default: symbol?.valueDeclaration
            ? this.getDefaultValue(symbol?.valueDeclaration)
            : undefined,
        }
      case this.checker.isArrayType(itemType):
        return {
          type: "array",
          description,
          items: this.typeToSchema({
            itemType: this.checker.getTypeArguments(
              itemType as ts.TypeReference
            )[0],
            level: maybeIncrementLevel(level, "array"),
            title,
            descriptionOptions:
              descriptionOptions || title
                ? {
                    ...descriptionOptions,
                    parentName: title || descriptionOptions?.parentName,
                  }
                : undefined,
            saveSchema,
            ...rest,
          }),
        }
      case itemType.isUnion():
        // if it's a union of literal types,
        // consider it an enum
        const cleanedUpTypes = this.typesHelper.cleanUpTypes(
          (itemType as ts.UnionType).types
        )
        const allLiteral = cleanedUpTypes.every((unionType) =>
          unionType.isLiteral()
        )

        if (allLiteral) {
          return {
            type: "string",
            description,
            enum: cleanedUpTypes.map(
              (unionType) => (unionType as ts.LiteralType).value
            ),
          }
        }

        const oneOfItems = cleanedUpTypes.map((unionType) =>
          this.typeToSchema({
            itemType: unionType,
            level: maybeIncrementLevel(level, "oneOf"),
            title,
            descriptionOptions,
            saveSchema,
            ...rest,
          })
        )

        if (oneOfItems.length === 1) {
          return oneOfItems[0]
        }

        return {
          oneOf: oneOfItems,
        }
      case itemType.isIntersection():
        const allOfItems = this.typesHelper
          .cleanUpTypes((itemType as ts.IntersectionType).types)
          .map((intersectionType) => {
            return this.typeToSchema({
              itemType: intersectionType,
              level: maybeIncrementLevel(level, "allOf"),
              title,
              descriptionOptions,
              saveSchema,
              ...rest,
            })
          })

        if (allOfItems.length === 1) {
          return allOfItems[0]
        }

        return {
          allOf: allOfItems,
        }
      case typeAsString.startsWith("Pick"):
        const pickTypeArgs =
          itemType.aliasTypeArguments ||
          this.checker.getTypeArguments(itemType as ts.TypeReference)

        if (pickTypeArgs.length < 2) {
          return {}
        }
        const pickedProperties = pickTypeArgs[1].isUnion()
          ? pickTypeArgs[1].types.map((unionType) =>
              this.typesHelper.getTypeName(unionType)
            )
          : [this.typesHelper.getTypeName(pickTypeArgs[1])]
        return this.typeToSchema({
          itemType: pickTypeArgs[0],
          title,
          level,
          descriptionOptions,
          allowedChildren: pickedProperties,
          saveSchema,
          ...rest,
        })
      case typeAsString.startsWith("Omit"):
        const omitTypeArgs =
          itemType.aliasTypeArguments ||
          this.checker.getTypeArguments(itemType as ts.TypeReference)

        if (omitTypeArgs.length < 2) {
          return {}
        }
        const omitProperties = omitTypeArgs[1].isUnion()
          ? omitTypeArgs[1].types.map((unionType) =>
              this.typesHelper.getTypeName(unionType)
            )
          : [this.typesHelper.getTypeName(omitTypeArgs[1])]
        return this.typeToSchema({
          itemType: omitTypeArgs[0],
          title,
          level,
          descriptionOptions,
          disallowedChildren: omitProperties,
          saveSchema,
          ...rest,
        })
      case typeAsString.startsWith("Partial"):
        const typeArg =
          itemType.aliasTypeArguments ||
          this.checker.getTypeArguments(itemType as ts.TypeReference)
        if (!typeArg.length) {
          return {}
        }

        const schema = this.typeToSchema({
          itemType: typeArg[0],
          title,
          level,
          descriptionOptions,
          disallowedChildren,
          allowedChildren,
          saveSchema,
          ...rest,
        })

        // remove all required items
        delete schema.required

        return schema
      case itemType.isClassOrInterface() ||
        itemType.isTypeParameter() ||
        (itemType as ts.Type).flags === ts.TypeFlags.Object:
        const requiredProperties: string[] = []

        const baseType = itemType.getBaseTypes()?.[0]
        const isDeleteResponse =
          baseType?.aliasSymbol?.getEscapedName() === "DeleteResponse"

        const objSchema: OpenApiSchema = {
          type: "object",
          description,
          "x-schemaName":
            itemType.isClassOrInterface() ||
            itemType.isTypeParameter() ||
            (isZodObject(itemType) && zodObjectTypeName)
              ? this.oasSchemaHelper.normalizeSchemaName(typeAsString)
              : undefined,
          // this is changed later
          required: undefined,
        }

        const properties: Record<
          string,
          OpenApiSchema | OpenAPIV3.ReferenceObject
        > = {}
        let isAdditionalProperties = false

        if (!isLevelExceeded(level + 1, this.MAX_LEVEL)) {
          let itemProperties = itemType.getProperties()

          if (
            !itemProperties.length &&
            itemType.aliasTypeArguments?.length === 2 &&
            itemType.aliasTypeArguments[0].flags === ts.TypeFlags.String
          ) {
            const isValueObj =
              itemType.aliasTypeArguments[1].isClassOrInterface() ||
              itemType.aliasTypeArguments[1].isTypeParameter() ||
              ((itemType.aliasTypeArguments[1] as ts.Type).flags ===
                ts.TypeFlags.Object &&
                !this.checker.isArrayType(itemType.aliasTypeArguments[1]))

            if (isValueObj) {
              // object has dynamic keys, so put the properties under additionalProperties
              itemProperties = itemType.aliasTypeArguments[1].getProperties()
              isAdditionalProperties = true
            }
          }

          itemProperties.forEach((property) => {
            if (
              (allowedChildren && !allowedChildren.includes(property.name)) ||
              (disallowedChildren && disallowedChildren.includes(property.name))
            ) {
              return
            }

            const shouldIgnore = property
              .getJsDocTags()
              .some((tag) => tag.name === "ignore")

            if (shouldIgnore) {
              return
            }

            if (this.isRequired(property)) {
              requiredProperties.push(property.name)
            }
            const propertyType = this.checker.getTypeOfSymbol(property)

            // if property's type is same as parent's property,
            // create a reference to the parent
            const arrHasParentType =
              rest.context !== "query" &&
              this.checker.isArrayType(propertyType) &&
              this.typesHelper.areTypesEqual(
                itemType,
                this.checker.getTypeArguments(
                  propertyType as ts.TypeReference
                )[0]
              )
            const isParentType =
              rest.context !== "query" &&
              this.typesHelper.areTypesEqual(itemType, propertyType)

            if (isParentType && objSchema["x-schemaName"]) {
              properties[property.name] = {
                $ref: this.oasSchemaHelper.constructSchemaReference(
                  objSchema["x-schemaName"]
                ),
              }

              return
            } else if (arrHasParentType && objSchema["x-schemaName"]) {
              properties[property.name] = {
                type: "array",
                description,
                items: {
                  $ref: this.oasSchemaHelper.constructSchemaReference(
                    objSchema["x-schemaName"]
                  ),
                },
              } as OpenAPIV3.ArraySchemaObject

              return
            }

            properties[property.name] = this.typeToSchema({
              itemType: propertyType,
              level: maybeIncrementLevel(level, "object"),
              title: property.name,
              descriptionOptions: {
                ...descriptionOptions,
                typeStr: property.name,
                parentName: title || descriptionOptions?.parentName,
              },
              saveSchema,
              ...rest,
            })

            if (
              isDeleteResponse &&
              property.name === "object" &&
              !this.oasSchemaHelper.isRefObject(properties[property.name])
            ) {
              const schemaProperty = properties[property.name] as OpenApiSchema
              // try to retrieve default from `DeleteResponse`'s type argument
              const deleteTypeArg = baseType.aliasTypeArguments?.[0]
              schemaProperty.default =
                deleteTypeArg && "value" in deleteTypeArg
                  ? (deleteTypeArg.value as string)
                  : schemaProperty.default
            }
          })
        }

        if (Object.values(properties).length) {
          if (isAdditionalProperties) {
            objSchema.additionalProperties = {
              type: "object",
              properties,
            }
          } else {
            objSchema.properties = properties
          }
        }

        objSchema.required =
          requiredProperties.length > 0 ? requiredProperties : undefined

        if (saveSchema && objSchema["x-schemaName"]) {
          // add object to schemas to be created
          // if necessary
          this.oasSchemaHelper.namedSchemaToReference(objSchema)
        }

        return objSchema
      default:
        return {}
    }
  }

  /**
   * Retrieve the description of a symbol, type, or node. Can be used to retrieve
   * the description of a property or parameter in a schema.
   *
   * @param param0 - The details of the item to retrieve its description.
   * @returns The description.
   */
  getSchemaDescription({
    symbol,
    node,
    nodeType,
    typeStr,
    ...templateOptions
  }: SchemaDescriptionOptions): string {
    if (!symbol && !node && !nodeType) {
      // if none of the associated symbol, node, or type are provided,
      // either retrieve the description from the knowledge base or use
      // the default summary
      return (
        this.knowledgeBaseFactory.tryToGetOasSchemaDescription({
          str: typeStr,
          templateOptions,
        }) || SUMMARY_PLACEHOLDER
      )
    }

    if (node) {
      return this.getNodeSummary({
        node: node,
        symbol,
        nodeType,
      })
    }

    let description = ""

    if (nodeType) {
      description = this.getTypeDocBlock(nodeType)
    }

    if (!description.length && symbol) {
      description = this.getSymbolDocBlock(symbol)
    }

    return description.length ? description : SUMMARY_PLACEHOLDER
  }

  /**
   * Check whether a symbol is required.
   *
   * @param symbol - The symbol to check.
   * @param level - The current recursion level to avoid max-stack error
   * @returns Whether the symbol is required.
   */
  isRequired(symbol: ts.Symbol, level = 1): boolean {
    let isRequired = true
    const checkNode = (node: ts.Node) => {
      switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
          const expression =
            "expression" in node
              ? (node.expression as ts.Expression)
              : undefined

          if (!expression || !("name" in expression)) {
            break
          }

          const expressionName = (expression.name as ts.Identifier).getText()
          isRequired =
            expressionName !== "optional" && expressionName !== "nullish"
          break
        case ts.SyntaxKind.QuestionToken:
          isRequired = false
      }

      if (!isRequired) {
        return
      }

      node.forEachChild(checkNode)
    }
    if (
      !symbol.valueDeclaration &&
      symbol.declarations?.length &&
      "symbol" in symbol.declarations[0] &&
      !isLevelExceeded(level, this.MAX_LEVEL)
    ) {
      return this.isRequired(
        symbol.declarations[0].symbol as ts.Symbol,
        maybeIncrementLevel(level, "object")
      )
    }

    ;(symbol.valueDeclaration || symbol.declarations?.[0])?.forEachChild(
      checkNode
    )

    return isRequired
  }

  /**
   * Retrieve the format of a property/parameter in a schema.
   *
   * @param param0 - The item's details.
   * @returns The format, if available.
   */
  getSchemaTypeFormat({
    typeName,
    name,
  }: {
    typeName: string
    name?: string
  }): string | undefined {
    switch (true) {
      case typeName === "Date":
        return "date-time"
      case name?.includes("email"):
        return "email"
      case name?.includes("password"):
        return "password"
    }
  }

  /**
   * Initialize the {@link tags} property.
   */
  init() {
    this.tags.set("admin", new Set())
    this.tags.set("store", new Set())
  }

  /**
   * Update an array of parameters with a new one.
   *
   * @param param0 - The parameter details.
   * @returns The updated parameters.
   */
  updateParameters({
    oldParameters,
    newParameters,
    type,
  }: {
    /**
     * The old list of parameters.
     */
    oldParameters?: OpenAPIV3.ParameterObject[]
    /**
     * The new list of parameters.
     */
    newParameters?: OpenAPIV3.ParameterObject[]
    /**
     * The type of parameters.
     */
    type: ParameterType
  }): OpenAPIV3.ParameterObject[] {
    if (!oldParameters) {
      return newParameters || []
    }
    const oppositeParamType = type === "query" ? "path" : "query"
    const oppositeParams: OpenAPIV3.ParameterObject[] =
      oldParameters?.filter((param) => param.in === oppositeParamType) || []
    // check and update/add parameters if necessary
    const existingParams: OpenAPIV3.ParameterObject[] =
      oldParameters?.filter((param) => param.in === type) || []
    const paramsToRemove = new Set<string>()

    existingParams.forEach((parameter) => {
      const updatedParameter = newParameters?.find(
        (newParam) => newParam.name === parameter.name
      )
      if (!updatedParameter) {
        // remove the parameter
        paramsToRemove.add(parameter.name)
        return
      }

      if (
        updatedParameter.description !== parameter.description &&
        parameter.description === SUMMARY_PLACEHOLDER
      ) {
        parameter.description = updatedParameter.description
      }

      if (updatedParameter.required !== parameter.required) {
        parameter.required = updatedParameter.required
      }

      if (
        (updatedParameter.schema as OpenApiSchema).type !==
        (parameter.schema as OpenApiSchema).type
      ) {
        // the entire schema should be updated if the type changes.
        parameter.schema = updatedParameter.schema
      } else if ((updatedParameter.schema as OpenApiSchema).type === "array") {
        ;(parameter.schema as OpenAPIV3.ArraySchemaObject).items =
          this.updateSchema({
            oldSchema: (parameter.schema as OpenAPIV3.ArraySchemaObject).items,
            newSchema: (updatedParameter.schema as OpenAPIV3.ArraySchemaObject)
              .items,
          }) || (updatedParameter.schema as OpenAPIV3.ArraySchemaObject).items
      } else if ((updatedParameter.schema as OpenApiSchema).type === "object") {
        parameter.schema =
          this.updateSchema({
            oldSchema: parameter.schema,
            newSchema: updatedParameter.schema,
          }) || updatedParameter.schema
      }

      if (
        (updatedParameter.schema as OpenApiSchema).title !==
        (parameter.schema as OpenApiSchema).title
      ) {
        ;(parameter.schema as OpenApiSchema).title = (
          updatedParameter.schema as OpenApiSchema
        ).title
      }

      if (
        (updatedParameter.schema as OpenApiSchema).description !==
          (parameter.schema as OpenApiSchema).description &&
        (parameter.schema as OpenApiSchema).description === SUMMARY_PLACEHOLDER
      ) {
        ;(parameter.schema as OpenApiSchema).description = (
          updatedParameter.schema as OpenApiSchema
        ).description
      }
    })

    // find new parameters to add
    newParameters?.forEach((parameter) => {
      if (existingParams.some((newParam) => newParam.name === parameter.name)) {
        return
      }

      existingParams?.push(parameter)
    })

    // remove parameters no longer existing
    return [
      ...oppositeParams,
      ...(existingParams?.filter(
        (parameter) =>
          (parameter as OpenAPIV3.ParameterObject).in === oppositeParamType ||
          !paramsToRemove.has((parameter as OpenAPIV3.ParameterObject).name)
      ) || []),
    ]
  }

  /**
   * Retrieve the updated schema. Can be used for request and response schemas.
   *
   * @param param0 - The schema details.
   * @returns The updated schema.
   */
  updateSchema({
    oldSchema,
    newSchema,
    level = 1,
  }: {
    /**
     * The old schema.
     */
    oldSchema?: OpenApiSchema | OpenAPIV3.ReferenceObject
    /**
     * The new schema.
     */
    newSchema?: OpenApiSchema | OpenAPIV3.ReferenceObject
    /**
     * The current level in the update schema. Used to avoid
     * maximum call stack size exceeded error
     */
    level?: number
  }): OpenApiSchema | undefined {
    if (isLevelExceeded(level, this.MAX_LEVEL)) {
      return
    }

    let oldSchemaObj = (
      oldSchema && "$ref" in oldSchema
        ? this.oasSchemaHelper.getSchemaByName(oldSchema.$ref, true, true)
            ?.schema
        : oldSchema
    ) as OpenApiSchema | undefined
    const newSchemaObj = (
      newSchema && "$ref" in newSchema
        ? this.oasSchemaHelper.getSchemaByName(newSchema.$ref)?.schema
        : newSchema
    ) as OpenApiSchema | undefined

    if (!oldSchemaObj && newSchemaObj) {
      return newSchemaObj
    } else if (!newSchemaObj || !Object.keys(newSchemaObj).length) {
      return undefined
    }

    const oldSchemaType = this.inferOasSchemaType(oldSchemaObj)
    const newSchemaType = this.inferOasSchemaType(newSchemaObj)

    if (oldSchemaType !== newSchemaType && newSchemaType && newSchemaObj) {
      oldSchemaObj = {
        ...newSchemaObj,
        description: oldSchemaObj?.description,
        example: oldSchemaObj?.example || newSchemaObj.example,
      }
    } else if (
      oldSchemaObj?.allOf &&
      newSchemaObj.allOf &&
      oldSchemaObj.allOf.length !== newSchemaObj.allOf.length
    ) {
      oldSchemaObj.allOf = newSchemaObj.allOf
    } else if (
      oldSchemaObj?.oneOf &&
      newSchemaObj.oneOf &&
      oldSchemaObj.oneOf.length !== newSchemaObj.oneOf.length
    ) {
      oldSchemaObj.oneOf = newSchemaObj.oneOf
    } else if (
      oldSchemaObj?.anyOf &&
      newSchemaObj.anyOf &&
      oldSchemaObj.anyOf.length !== newSchemaObj.anyOf.length
    ) {
      oldSchemaObj.anyOf = newSchemaObj.anyOf
    } else if (oldSchemaType === "object") {
      if (!oldSchemaObj?.properties && newSchemaObj?.properties) {
        oldSchemaObj!.properties = newSchemaObj.properties
      } else if (!newSchemaObj?.properties) {
        delete oldSchemaObj!.properties

        // check if additionalProperties should be updated
        if (
          !oldSchemaObj!.additionalProperties &&
          newSchemaObj.additionalProperties
        ) {
          oldSchemaObj!.additionalProperties = newSchemaObj.additionalProperties
        } else if (!newSchemaObj.additionalProperties) {
          delete oldSchemaObj!.additionalProperties
        } else if (
          typeof oldSchemaObj!.additionalProperties !== "boolean" &&
          typeof newSchemaObj!.additionalProperties !== "boolean"
        ) {
          oldSchemaObj!.additionalProperties =
            this.updateSchema({
              oldSchema: oldSchemaObj!.additionalProperties,
              newSchema: newSchemaObj.additionalProperties,
              level: maybeIncrementLevel(level, "object"),
            }) || oldSchemaObj!.additionalProperties
        }
      } else {
        // update existing properties
        Object.entries(oldSchemaObj!.properties!).forEach(
          ([propertyName, propertySchema]) => {
            const newPropertySchemaKey = Object.keys(
              newSchemaObj!.properties!
            ).find((newPropertyName) => newPropertyName === propertyName)
            if (!newPropertySchemaKey) {
              // remove property
              delete oldSchemaObj!.properties![propertyName]
              return
            }

            oldSchemaObj!.properties![propertyName] =
              this.updateSchema({
                oldSchema: propertySchema as OpenApiSchema,
                newSchema: newSchemaObj!.properties![
                  propertyName
                ] as OpenApiSchema,
                level: maybeIncrementLevel(level, "object"),
              }) || propertySchema
          }
        )
        // add new properties
        Object.keys(newSchemaObj!.properties!)
          .filter(
            (propertyKey) =>
              !Object.hasOwn(oldSchemaObj!.properties!, propertyKey)
          )
          .forEach((newPropertyKey) => {
            const tryToUpdateSchema = (
              schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
            ) => {
              let updatedSchema = schema
              const newPropertySchemaName = this.oasSchemaHelper.isRefObject(
                schema
              )
                ? schema.$ref
                : "x-schemaName" in schema
                  ? (schema["x-schemaName"] as string)
                  : undefined
              if (newPropertySchemaName) {
                const schemaToUpdate = this.oasSchemaHelper.getSchemaByName(
                  newPropertySchemaName,
                  true,
                  true
                )

                if (schemaToUpdate) {
                  updatedSchema =
                    this.updateSchema({
                      oldSchema: schemaToUpdate.schema,
                      newSchema: schema,
                      level: maybeIncrementLevel(level, "object"),
                    }) || newProperty
                }
              }

              return updatedSchema
            }

            let newProperty = newSchemaObj!.properties![newPropertyKey]

            if (
              !this.oasSchemaHelper.isRefObject(newProperty) &&
              newProperty.type === "array"
            ) {
              newProperty.items = tryToUpdateSchema(newProperty.items)
            } else {
              newProperty = tryToUpdateSchema(newProperty)
            }

            oldSchemaObj!.properties![newPropertyKey] = newProperty
          })
      }
    } else if (
      oldSchemaObj?.type === "array" &&
      newSchemaObj?.type === "array"
    ) {
      oldSchemaObj.items =
        this.updateSchema({
          oldSchema: oldSchemaObj.items as OpenApiSchema,
          newSchema: newSchemaObj!.items as OpenApiSchema,
          level: maybeIncrementLevel(level, "array"),
        }) || oldSchemaObj.items
    }

    if (
      oldSchemaObj!.description !== newSchemaObj?.description &&
      oldSchemaObj!.description === SUMMARY_PLACEHOLDER
    ) {
      oldSchemaObj!.description =
        newSchemaObj?.description || SUMMARY_PLACEHOLDER
    }

    oldSchemaObj!.required = newSchemaObj?.required
    oldSchemaObj!["x-schemaName"] = newSchemaObj?.["x-schemaName"]

    return oldSchemaObj
  }

  /**
   * This method infers a schema's type.
   *
   * @param schema - The schema to infer its type
   * @returns The type, if available.
   */
  inferOasSchemaType(schema?: OpenApiSchema): string | undefined {
    switch (true) {
      case schema === undefined:
        return undefined
      case schema?.allOf !== undefined:
        return "allOf"
      case schema?.anyOf !== undefined:
        return "anyOf"
      case schema?.oneOf !== undefined:
        return "oneOf"
      case schema?.type !== undefined:
        return schema.type
      case schema !== undefined:
      default:
        return "object"
    }
  }

  /**
   * This method retrieves the workflow used in an API route.
   *
   * @param node - The node to search through
   * @returns The workflow's name.
   */
  getAssociatedWorkflow(node: FunctionNode): string | undefined {
    let workflow: string | undefined

    if (!ts.isFunctionDeclaration(node) && !ts.isArrowFunction(node)) {
      return
    }

    const sourceFile = node.getSourceFile()

    // if a source file doesn't have imports, then it's assumed that it's not using workflows.
    if (!("imports" in sourceFile) || !Array.isArray(sourceFile.imports)) {
      return
    }

    // retrieve workflows imported from `@medusajs/core-flows`
    // since there could be multiple import statements from the
    // same package, put them in an array
    const coreFlowsImports: ts.ImportClause[] = []
    ;(sourceFile.imports as ts.Node[]).forEach((importNode) => {
      if (
        !importNode.parent ||
        !ts.isImportDeclaration(importNode.parent) ||
        !importNode.parent.importClause?.namedBindings ||
        importNode.getText() !== `"@medusajs/core-flows"`
      ) {
        return
      }

      coreFlowsImports.push(importNode.parent.importClause)
    })

    // if no imports found from `@medusajs/core-flows`, return
    if (!coreFlowsImports.length) {
      return
    }

    // check if any of the imported vars are used in the function node
    // const fileWorkflowImports: Map<string, ts.Identifier> = new Map()
    const fnText = node.getText()
    coreFlowsImports.forEach((coreFlowsImport) => {
      coreFlowsImport.namedBindings?.forEachChild((childImport) => {
        if (!ts.isImportSpecifier(childImport) || workflow) {
          return
        }

        const workflowName = childImport.name.getText()

        if (fnText.includes(workflowName)) {
          workflow = workflowName
        }
      })
    })

    return workflow
  }

  /**
   * Retrieve the file name that's used to write the OAS operation of a node.
   *
   * @param node - The node to retrieve its associated file name.
   * @returns The file name.
   */
  getAssociatedFileName(node: FunctionOrVariableNode): string {
    const methodName = this.getHTTPMethodName(node)
    const { oasPath } = this.getOasPath(node)
    const area = oasPath.split("/")[0]

    const filename = `${methodName}_${oasPath.replaceAll("/", "_")}.ts`

    return join(this.baseOutputPath, "operations", area, filename)
  }

  /**
   * This method is executed when the {@link GeneratorEvent.FINISHED_GENERATE_EVENT} event is triggered.
   * It writes new tags, if available, in base YAML.
   */
  afterGenerate() {
    this.writeNewTags("admin")
    this.writeNewTags("store")
    this.oasSchemaHelper.writeNewSchemas()

    // reset tags
    this.init()
    // reset schemas
    this.oasSchemaHelper.init()
  }

  /**
   * Add new tags to the base YAML of an area.
   *
   * @param area - The area that the tag belongs to.
   */
  writeNewTags(area: OasArea) {
    // load base oas files
    const areaYamlPath = join(
      this.baseOutputPath,
      "base",
      `${area}.oas.base.yaml`
    )
    const areaYaml = parse(
      readFileSync(areaYamlPath, "utf-8")
    ) as OpenApiDocument
    let modifiedTags = false

    areaYaml.tags = [...(areaYaml.tags || [])]

    this.tags.get(area)?.forEach((tag) => {
      const existingTag = areaYaml.tags!.find((baseTag) => baseTag.name === tag)
      const schemaName = this.oasSchemaHelper.tagNameToSchemaName(tag, area)
      const schema = this.oasSchemaHelper.getSchemaByName(schemaName, false)
      const associatedSchema = schema?.schema?.["x-schemaName"]
        ? {
            $ref: this.oasSchemaHelper.constructSchemaReference(
              schema.schema["x-schemaName"]
            ),
          }
        : undefined
      if (!existingTag) {
        areaYaml.tags!.push({
          name: tag,
          "x-associatedSchema": associatedSchema,
        })
        modifiedTags = true
      } else if (
        existingTag["x-associatedSchema"]?.$ref !== associatedSchema?.$ref
      ) {
        existingTag["x-associatedSchema"] = associatedSchema
        modifiedTags = true
      }
    })

    if (modifiedTags) {
      // sort alphabetically
      areaYaml.tags.sort((tagA, tagB) => {
        return tagA.name.localeCompare(tagB.name)
      })
      // write to the file
      writeFileSync(areaYamlPath, stringify(areaYaml))
    }
  }

  shouldAddQueryParams(node: FunctionNode): {
    shouldAddFields: boolean
    shouldAddPagination: boolean
  } {
    const fnText = node.getText()

    return {
      shouldAddFields: fnText.includes(`req.remoteQueryConfig.fields`),
      shouldAddPagination: fnText.includes(`req.remoteQueryConfig.pagination`),
    }
  }

  hasResponseType(node: FunctionNode, oas: OpenApiOperation): boolean {
    const oldResponseStatus = Object.keys(oas.responses!).find(
      (status) => !Object.keys(DEFAULT_OAS_RESPONSES).includes(status)
    )
    if (!oldResponseStatus) {
      return false
    }

    const responseContent = (
      oas.responses![oldResponseStatus] as OpenAPIV3.ResponseObject
    ).content
    if (!responseContent) {
      return false
    }

    const fnText = node.getText()

    return Object.keys(responseContent).some((responseType) =>
      fnText.includes(responseType)
    )
  }
}

export default OasKindGenerator
