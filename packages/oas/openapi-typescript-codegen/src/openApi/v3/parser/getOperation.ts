import type { Operation } from "../../../client/interfaces/Operation"
import type { OperationParameters } from "../../../client/interfaces/OperationParameters"
import type { OperationCodegen } from "../../../client/interfaces/OperationCodegen"
import type { OpenApi } from "../interfaces/OpenApi"
import type { OpenApiOperation } from "../interfaces/OpenApiOperation"
import type { OpenApiRequestBody } from "../interfaces/OpenApiRequestBody"
import { getOperationErrors } from "./getOperationErrors"
import { getOperationName } from "./getOperationName"
import { getOperationParameters } from "./getOperationParameters"
import { getOperationRequestBody } from "./getOperationRequestBody"
import { getOperationResponseHeader } from "./getOperationResponseHeader"
import { getOperationResponses } from "./getOperationResponses"
import { getOperationResults } from "./getOperationResults"
import { getRef } from "./getRef"
import { getServiceName } from "./getServiceName"
import { sortByRequired } from "./sortByRequired"

export const getOperation = (
  openApi: OpenApi,
  url: string,
  method: string,
  tag: string,
  op: OpenApiOperation,
  pathParams: OperationParameters
): Operation => {
  const serviceName = getServiceName(tag)
  const operationName = getOperationName(url, method, op.operationId)
  const codegen: OperationCodegen = op["x-codegen"] || {}

  // Create a new operation object for this method.
  const operation: Operation = {
    service: serviceName,
    name: codegen.method || operationName,
    operationId: op.operationId || null,
    summary: op.summary || null,
    description: op.description || null,
    deprecated: op.deprecated === true,
    method: method.toUpperCase(),
    path: url,
    parameters: [...pathParams.parameters],
    parametersPath: [...pathParams.parametersPath],
    parametersQuery: [...pathParams.parametersQuery],
    parametersForm: [...pathParams.parametersForm],
    parametersHeader: [...pathParams.parametersHeader],
    parametersCookie: [...pathParams.parametersCookie],
    parametersBody: pathParams.parametersBody,
    imports: [],
    errors: [],
    results: [],
    responseHeader: null,
    codegen,
  }

  // Parse the operation parameters (path, query, body, etc).
  if (op.parameters) {
    const parameters = getOperationParameters(openApi, op.parameters)
    operation.imports.push(...parameters.imports)
    operation.parameters.push(...parameters.parameters)
    operation.parametersPath.push(...parameters.parametersPath)
    operation.parametersQuery.push(...parameters.parametersQuery)
    operation.parametersForm.push(...parameters.parametersForm)
    operation.parametersHeader.push(...parameters.parametersHeader)
    operation.parametersCookie.push(...parameters.parametersCookie)
    operation.parametersBody = parameters.parametersBody
  }

  if (op.requestBody) {
    const requestBodyDef = getRef<OpenApiRequestBody>(openApi, op.requestBody)
    const requestBody = getOperationRequestBody(openApi, requestBodyDef)
    operation.imports.push(...requestBody.imports)
    operation.parameters.push(requestBody)
    operation.parametersBody = requestBody
  }

  // Parse the operation responses.
  if (op.responses) {
    const operationResponses = getOperationResponses(openApi, op.responses)
    const operationResults = getOperationResults(operationResponses)
    operation.errors = getOperationErrors(operationResponses)
    operation.responseHeader = getOperationResponseHeader(operationResults)

    operationResults.forEach((operationResult) => {
      operation.results.push(operationResult)
      operation.imports.push(...operationResult.imports)
    })
  }

  if (codegen.queryParams) {
    operation.imports.push(codegen.queryParams)
  }

  operation.parameters = operation.parameters.sort(sortByRequired)

  return operation
}
