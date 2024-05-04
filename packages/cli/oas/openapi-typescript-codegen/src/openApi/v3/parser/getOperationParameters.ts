import type { OperationParameters } from "../../../client/interfaces/OperationParameters"
import type { OpenApi } from "../interfaces/OpenApi"
import type { OpenApiParameter } from "../interfaces/OpenApiParameter"
import { getOperationParameter } from "./getOperationParameter"
import { getRef } from "./getRef"

export const getOperationParameters = (
  openApi: OpenApi,
  parameters: OpenApiParameter[]
): OperationParameters => {
  const operationParameters: OperationParameters = {
    imports: [],
    parameters: [],
    parametersPath: [],
    parametersQuery: [],
    parametersForm: [],
    parametersCookie: [],
    parametersHeader: [],
    parametersBody: null, // Not used in V3 -> @see requestBody
  }

  // Iterate over the parameters
  parameters.forEach((parameterOrReference) => {
    const parameterDef = getRef<OpenApiParameter>(openApi, parameterOrReference)
    const parameter = getOperationParameter(openApi, parameterDef)

    // We ignore the "api-version" param, since we do not want to add this
    // as the first / default parameter for each of the service calls.
    if (parameter.prop !== "api-version") {
      switch (parameterDef.in) {
        case "path":
          operationParameters.parametersPath.push(parameter)
          operationParameters.parameters.push(parameter)
          operationParameters.imports.push(...parameter.imports)
          break

        case "query":
          operationParameters.parametersQuery.push(parameter)
          operationParameters.parameters.push(parameter)
          operationParameters.imports.push(...parameter.imports)
          break

        case "formData":
          operationParameters.parametersForm.push(parameter)
          operationParameters.parameters.push(parameter)
          operationParameters.imports.push(...parameter.imports)
          break

        case "cookie":
          operationParameters.parametersCookie.push(parameter)
          operationParameters.parameters.push(parameter)
          operationParameters.imports.push(...parameter.imports)
          break

        case "header":
          operationParameters.parametersHeader.push(parameter)
          operationParameters.parameters.push(parameter)
          operationParameters.imports.push(...parameter.imports)
          break
      }
    }
  })
  return operationParameters
}
