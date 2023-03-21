import { resolve } from "path"

import type { Model } from "../client/interfaces/Model"
import type { Service } from "../client/interfaces/Service"
import type { Indent } from "../Indent"
import { mkdir, writeFile } from "./fileSystem"
import { formatCode as f } from "./formatCode"
import { formatIndentation as i } from "./formatIndentation"
import type { Templates } from "./registerHandlebarTemplates"
import { PackageNames } from "../index"

const EXPORT_REFERENCE = "reference"
const EXPORT_ARRAY = "array"
const EXPORT_DICTIONARY = "dictionary"
const EXPORT_INTERFACE = "interface"

/**
 * Output code usage samples to feed to Redocly x-codeSamples
 */
export const writeClientSamples = async (
  models: Model[],
  services: Service[],
  templates: Templates,
  outputPath: string,
  indent: Indent,
  clientName?: string,
  packageNames: PackageNames = {}
): Promise<void> => {
  for (const service of services) {
    for (const operation of service.operations) {
      if (!operation.operationId) {
        continue
      }

      /**
       * Enhance Requests
       */
      let payloadReqExample: Record<string, unknown> = {}

      if (
        operation.parametersBody &&
        operation.parametersBody.export === EXPORT_REFERENCE
      ) {
        let model = getModelByName(operation.parametersBody.base, models)
        if (model && model.export === EXPORT_REFERENCE) {
          /** This is an alias. We need to find the real model. */
          model = getModelByName(model.base, models)
        }
        if (model) {
          payloadReqExample =
            model.spec.example ?? getExampleForModel(model, models)
        }
      }

      let payloadReqExampleString = JSON.stringify(payloadReqExample, null, 2)
      if (payloadReqExampleString === "{}") {
        payloadReqExampleString = `{ /* your payload data */ }`
      }

      /**
       * Enhance Responses
       */
      const response = operation.results[0]

      /**
       * Render
       */
      const serviceName = service.name.toLowerCase()
      const methodName = operation.codegen.method ?? operation.operationId
      const payloadReqType =
        operation.parametersBody?.export === EXPORT_REFERENCE
          ? operation.parametersBody.base
          : undefined
      const queryParamsType = operation.codegen.queryParams ?? undefined
      const responseType =
        response.export === EXPORT_REFERENCE ? response.base : undefined
      const typeImports = [
        payloadReqType,
        queryParamsType,
        responseType,
      ].filter((targetType) => targetType !== undefined)

      for (const language of ["ts", "js", "sh"]) {
        const outputSubPath = resolve(outputPath, language)
        await mkdir(outputSubPath)
        const file = resolve(
          outputSubPath,
          `${operation.operationId}.${language}`
        )
        const templateResult = templates.exports.sample({
          language,
          operation,
          serviceName,
          methodName,
          payloadReqType,
          payloadReqExampleString,
          queryParamsType,
          responseType,
          typeImports,
          hasTypeImports: typeImports.length > 0,
          hasAuthentication: operation.security.length > 0,
          modelsPackageName: packageNames.models ?? "@medusajs/client-types",
          clientPackageName: packageNames.client ?? "@medusajs/medusa-js",
          clientName: clientName ?? "Medusa",
        })
        await writeFile(file, i(f(templateResult), indent))
      }
    }
  }
}

function getModelByName(name: string, models: Model[]): Model | void {
  for (const model of models) {
    if (model.name === name) {
      return model
    }
  }
}

function getExampleForModel(
  model: Model,
  models: Model[]
): Record<string, unknown> {
  if (model.spec.example) {
    return model.spec.example
  }
  const example: Record<string, unknown> = {}
  for (const property of model.properties) {
    if (property.isRequired) {
      example[property.name] = getExampleForProperty(property, models)
    }
  }
  return example
}

function getExampleForProperty(property: Model, models: Model[]): unknown {
  if (property.export === EXPORT_ARRAY) {
    if (property.link) {
      return [getExampleForProperty(property.link, models)]
    }
    console.debug("payloadReq example: UNHANDLED ARRAY")
    console.debug(JSON.stringify(property, null, 2))
    return []
  }

  if (property.spec.example) {
    return property.spec.example
  }

  if (property.export === EXPORT_REFERENCE) {
    const model = getModelByName(property.base, models)
    if (model) {
      return getExampleForModel(model, models)
    }
    console.debug("payloadReq example: UNHANDLED REFERENCE")
    console.debug(JSON.stringify(property, null, 2))
    return {}
  }
  if (property.export === EXPORT_INTERFACE) {
    return getExampleForModel(property, models)
  }
  if (property.type === "string") {
    if (property.spec.format) {
      return getStringExampleByFormat(property.spec.format)
    }
    return "string"
  }
  if (property.type === "number") {
    return 1
  }
  if (property.type === "boolean") {
    return true
  }
  if (property.export === EXPORT_DICTIONARY) {
    return {}
  }
  console.debug("payloadReq example: UNHANDLED UNKNOWN")
  console.debug(JSON.stringify(property, null, 2))
  return undefined
}

function getStringExampleByFormat(format: string): string {
  switch (format) {
    case "date":
      return "2019-01-01"
    case "date-time":
      return "2019-01-01T00:00:00.000Z"
    case "email":
      return "user@example.com"
    case "password":
      return "pa$$word"
    case "uri":
      return "https://example.com"
    case "binary":
      return "base64string"
  }
  return "string"
}
