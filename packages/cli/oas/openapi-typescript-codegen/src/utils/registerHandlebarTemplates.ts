import Handlebars from "handlebars/runtime"

import { HttpClient } from "../HttpClient"
import templateClient from "../templates/client.hbs"
import templateUseClient from "../templates/useClient.hbs"
import templateCoreApiError from "../templates/core/ApiError.hbs"
import templateCoreApiRequestOptions from "../templates/core/ApiRequestOptions.hbs"
import templateCoreApiResult from "../templates/core/ApiResult.hbs"
import templateCoreHookUtils from "../templates/core/HookUtils.hbs"
import templateCoreModelUtils from "../templates/core/ModelUtils.hbs"
import axiosGetHeaders from "../templates/core/axios/getHeaders.hbs"
import axiosGetRequestBody from "../templates/core/axios/getRequestBody.hbs"
import axiosGetResponseBody from "../templates/core/axios/getResponseBody.hbs"
import axiosGetResponseHeader from "../templates/core/axios/getResponseHeader.hbs"
import axiosRequest from "../templates/core/axios/request.hbs"
import axiosSendRequest from "../templates/core/axios/sendRequest.hbs"
import templateCoreBaseHttpRequest from "../templates/core/BaseHttpRequest.hbs"
import templateCancelablePromise from "../templates/core/CancelablePromise.hbs"
import fetchGetHeaders from "../templates/core/fetch/getHeaders.hbs"
import fetchGetRequestBody from "../templates/core/fetch/getRequestBody.hbs"
import fetchGetResponseBody from "../templates/core/fetch/getResponseBody.hbs"
import fetchGetResponseHeader from "../templates/core/fetch/getResponseHeader.hbs"
import fetchRequest from "../templates/core/fetch/request.hbs"
import fetchSendRequest from "../templates/core/fetch/sendRequest.hbs"
import functionBase64 from "../templates/core/functions/base64.hbs"
import functionCatchErrorCodes from "../templates/core/functions/catchErrorCodes.hbs"
import functionGetFormData from "../templates/core/functions/getFormData.hbs"
import functionGetQueryString from "../templates/core/functions/getQueryString.hbs"
import functionGetUrl from "../templates/core/functions/getUrl.hbs"
import functionIsBlob from "../templates/core/functions/isBlob.hbs"
import functionIsDefined from "../templates/core/functions/isDefined.hbs"
import functionIsFormData from "../templates/core/functions/isFormData.hbs"
import functionIsString from "../templates/core/functions/isString.hbs"
import functionIsStringWithValue from "../templates/core/functions/isStringWithValue.hbs"
import functionIsSuccess from "../templates/core/functions/isSuccess.hbs"
import functionResolve from "../templates/core/functions/resolve.hbs"
import templateCoreHttpRequest from "../templates/core/HttpRequest.hbs"
import nodeGetHeaders from "../templates/core/node/getHeaders.hbs"
import nodeGetRequestBody from "../templates/core/node/getRequestBody.hbs"
import nodeGetResponseBody from "../templates/core/node/getResponseBody.hbs"
import nodeGetResponseHeader from "../templates/core/node/getResponseHeader.hbs"
import nodeRequest from "../templates/core/node/request.hbs"
import nodeSendRequest from "../templates/core/node/sendRequest.hbs"
import templateCoreSettings from "../templates/core/OpenAPI.hbs"
import templateCoreRequest from "../templates/core/request.hbs"
import xhrGetHeaders from "../templates/core/xhr/getHeaders.hbs"
import xhrGetRequestBody from "../templates/core/xhr/getRequestBody.hbs"
import xhrGetResponseBody from "../templates/core/xhr/getResponseBody.hbs"
import xhrGetResponseHeader from "../templates/core/xhr/getResponseHeader.hbs"
import xhrRequest from "../templates/core/xhr/request.hbs"
import xhrSendRequest from "../templates/core/xhr/sendRequest.hbs"
import templateExportModel from "../templates/exportModel.hbs"
import templateExportSchema from "../templates/exportSchema.hbs"
import templateExportService from "../templates/exportService.hbs"
import templateExportHook from "../templates/exportHook.hbs"
import templateIndex from "../templates/indexes/index.hbs"
import templateIndexModels from "../templates/indexes/indexModels.hbs"
import templateIndexServices from "../templates/indexes/indexServices.hbs"
import templateIndexHooks from "../templates/indexes/indexHooks.hbs"
import partialBase from "../templates/partials/base.hbs"
import partialExportComposition from "../templates/partials/exportComposition.hbs"
import partialExportEnum from "../templates/partials/exportEnum.hbs"
import partialExportInterface from "../templates/partials/exportInterface.hbs"
import partialExportType from "../templates/partials/exportType.hbs"
import partialHeader from "../templates/partials/header.hbs"
import partialIsNullable from "../templates/partials/isNullable.hbs"
import partialIsReadOnly from "../templates/partials/isReadOnly.hbs"
import partialIsRequired from "../templates/partials/isRequired.hbs"
import partialParameters from "../templates/partials/parameters.hbs"
import partialParametersUntyped from "../templates/partials/parametersUntyped.hbs"
import partialResult from "../templates/partials/result.hbs"
import partialSchema from "../templates/partials/schema.hbs"
import partialSchemaArray from "../templates/partials/schemaArray.hbs"
import partialSchemaComposition from "../templates/partials/schemaComposition.hbs"
import partialSchemaDictionary from "../templates/partials/schemaDictionary.hbs"
import partialSchemaEnum from "../templates/partials/schemaEnum.hbs"
import partialSchemaGeneric from "../templates/partials/schemaGeneric.hbs"
import partialSchemaInterface from "../templates/partials/schemaInterface.hbs"
import partialType from "../templates/partials/type.hbs"
import partialTypeArray from "../templates/partials/typeArray.hbs"
import partialTypeDictionary from "../templates/partials/typeDictionary.hbs"
import partialTypeEnum from "../templates/partials/typeEnum.hbs"
import partialTypeGeneric from "../templates/partials/typeGeneric.hbs"
import partialTypeInterface from "../templates/partials/typeInterface.hbs"
import partialTypeIntersection from "../templates/partials/typeIntersection.hbs"
import partialTypeReference from "../templates/partials/typeReference.hbs"
import partialTypeUnion from "../templates/partials/typeUnion.hbs"
import partialTypeWithRelation from "../templates/partials/typeWithRelation.hbs"
import { registerHandlebarHelpers } from "./registerHandlebarHelpers"

export interface Templates {
  indexes: {
    index: Handlebars.TemplateDelegate
    indexModels: Handlebars.TemplateDelegate
    indexServices: Handlebars.TemplateDelegate
    indexHooks: Handlebars.TemplateDelegate
  }
  client: Handlebars.TemplateDelegate
  useClient: Handlebars.TemplateDelegate
  exports: {
    model: Handlebars.TemplateDelegate
    schema: Handlebars.TemplateDelegate
    service: Handlebars.TemplateDelegate
    hook: Handlebars.TemplateDelegate
  }
  core: {
    settings: Handlebars.TemplateDelegate
    apiError: Handlebars.TemplateDelegate
    apiRequestOptions: Handlebars.TemplateDelegate
    apiResult: Handlebars.TemplateDelegate
    cancelablePromise: Handlebars.TemplateDelegate
    request: Handlebars.TemplateDelegate
    baseHttpRequest: Handlebars.TemplateDelegate
    httpRequest: Handlebars.TemplateDelegate
    hookUtils: Handlebars.TemplateDelegate
    modelUtils: Handlebars.TemplateDelegate
  }
}

/**
 * Read all the Handlebar templates that we need and return on wrapper object
 * so we can easily access the templates in out generator / write functions.
 */
export const registerHandlebarTemplates = (root: {
  httpClient: HttpClient
  useOptions: boolean
  useUnionTypes: boolean
}): Templates => {
  registerHandlebarHelpers(root)

  // Main templates (entry points for the files we write to disk)
  const templates: Templates = {
    indexes: {
      index: Handlebars.template(templateIndex),
      indexModels: Handlebars.template(templateIndexModels),
      indexServices: Handlebars.template(templateIndexServices),
      indexHooks: Handlebars.template(templateIndexHooks),
    },
    client: Handlebars.template(templateClient),
    useClient: Handlebars.template(templateUseClient),
    exports: {
      model: Handlebars.template(templateExportModel),
      schema: Handlebars.template(templateExportSchema),
      service: Handlebars.template(templateExportService),
      hook: Handlebars.template(templateExportHook),
    },
    core: {
      settings: Handlebars.template(templateCoreSettings),
      apiError: Handlebars.template(templateCoreApiError),
      apiRequestOptions: Handlebars.template(templateCoreApiRequestOptions),
      apiResult: Handlebars.template(templateCoreApiResult),
      cancelablePromise: Handlebars.template(templateCancelablePromise),
      request: Handlebars.template(templateCoreRequest),
      baseHttpRequest: Handlebars.template(templateCoreBaseHttpRequest),
      httpRequest: Handlebars.template(templateCoreHttpRequest),
      hookUtils: Handlebars.template(templateCoreHookUtils),
      modelUtils: Handlebars.template(templateCoreModelUtils),
    },
  }

  // Partials for the generations of the models, services, etc.
  Handlebars.registerPartial(
    "exportEnum",
    Handlebars.template(partialExportEnum)
  )
  Handlebars.registerPartial(
    "exportInterface",
    Handlebars.template(partialExportInterface)
  )
  Handlebars.registerPartial(
    "exportComposition",
    Handlebars.template(partialExportComposition)
  )
  Handlebars.registerPartial(
    "exportType",
    Handlebars.template(partialExportType)
  )
  Handlebars.registerPartial("header", Handlebars.template(partialHeader))
  Handlebars.registerPartial(
    "isNullable",
    Handlebars.template(partialIsNullable)
  )
  Handlebars.registerPartial(
    "isReadOnly",
    Handlebars.template(partialIsReadOnly)
  )
  Handlebars.registerPartial(
    "isRequired",
    Handlebars.template(partialIsRequired)
  )
  Handlebars.registerPartial(
    "parameters",
    Handlebars.template(partialParameters)
  )
  Handlebars.registerPartial(
    "parametersUntyped",
    Handlebars.template(partialParametersUntyped)
  )
  Handlebars.registerPartial("result", Handlebars.template(partialResult))
  Handlebars.registerPartial("schema", Handlebars.template(partialSchema))
  Handlebars.registerPartial(
    "schemaArray",
    Handlebars.template(partialSchemaArray)
  )
  Handlebars.registerPartial(
    "schemaDictionary",
    Handlebars.template(partialSchemaDictionary)
  )
  Handlebars.registerPartial(
    "schemaEnum",
    Handlebars.template(partialSchemaEnum)
  )
  Handlebars.registerPartial(
    "schemaGeneric",
    Handlebars.template(partialSchemaGeneric)
  )
  Handlebars.registerPartial(
    "schemaInterface",
    Handlebars.template(partialSchemaInterface)
  )
  Handlebars.registerPartial(
    "schemaComposition",
    Handlebars.template(partialSchemaComposition)
  )
  Handlebars.registerPartial("type", Handlebars.template(partialType))
  Handlebars.registerPartial("typeArray", Handlebars.template(partialTypeArray))
  Handlebars.registerPartial(
    "typeDictionary",
    Handlebars.template(partialTypeDictionary)
  )
  Handlebars.registerPartial("typeEnum", Handlebars.template(partialTypeEnum))
  Handlebars.registerPartial(
    "typeGeneric",
    Handlebars.template(partialTypeGeneric)
  )
  Handlebars.registerPartial(
    "typeInterface",
    Handlebars.template(partialTypeInterface)
  )
  Handlebars.registerPartial(
    "typeReference",
    Handlebars.template(partialTypeReference)
  )
  Handlebars.registerPartial("typeUnion", Handlebars.template(partialTypeUnion))
  Handlebars.registerPartial(
    "typeIntersection",
    Handlebars.template(partialTypeIntersection)
  )
  Handlebars.registerPartial(
    "typeWithRelation",
    Handlebars.template(partialTypeWithRelation)
  )
  Handlebars.registerPartial("base", Handlebars.template(partialBase))

  // Generic functions used in 'request' file @see src/templates/core/request.hbs for more info
  Handlebars.registerPartial(
    "functions/catchErrorCodes",
    Handlebars.template(functionCatchErrorCodes)
  )
  Handlebars.registerPartial(
    "functions/getFormData",
    Handlebars.template(functionGetFormData)
  )
  Handlebars.registerPartial(
    "functions/getQueryString",
    Handlebars.template(functionGetQueryString)
  )
  Handlebars.registerPartial(
    "functions/getUrl",
    Handlebars.template(functionGetUrl)
  )
  Handlebars.registerPartial(
    "functions/isBlob",
    Handlebars.template(functionIsBlob)
  )
  Handlebars.registerPartial(
    "functions/isDefined",
    Handlebars.template(functionIsDefined)
  )
  Handlebars.registerPartial(
    "functions/isFormData",
    Handlebars.template(functionIsFormData)
  )
  Handlebars.registerPartial(
    "functions/isString",
    Handlebars.template(functionIsString)
  )
  Handlebars.registerPartial(
    "functions/isStringWithValue",
    Handlebars.template(functionIsStringWithValue)
  )
  Handlebars.registerPartial(
    "functions/isSuccess",
    Handlebars.template(functionIsSuccess)
  )
  Handlebars.registerPartial(
    "functions/base64",
    Handlebars.template(functionBase64)
  )
  Handlebars.registerPartial(
    "functions/resolve",
    Handlebars.template(functionResolve)
  )

  // Specific files for the fetch client implementation
  Handlebars.registerPartial(
    "fetch/getHeaders",
    Handlebars.template(fetchGetHeaders)
  )
  Handlebars.registerPartial(
    "fetch/getRequestBody",
    Handlebars.template(fetchGetRequestBody)
  )
  Handlebars.registerPartial(
    "fetch/getResponseBody",
    Handlebars.template(fetchGetResponseBody)
  )
  Handlebars.registerPartial(
    "fetch/getResponseHeader",
    Handlebars.template(fetchGetResponseHeader)
  )
  Handlebars.registerPartial(
    "fetch/sendRequest",
    Handlebars.template(fetchSendRequest)
  )
  Handlebars.registerPartial("fetch/request", Handlebars.template(fetchRequest))

  // Specific files for the xhr client implementation
  Handlebars.registerPartial(
    "xhr/getHeaders",
    Handlebars.template(xhrGetHeaders)
  )
  Handlebars.registerPartial(
    "xhr/getRequestBody",
    Handlebars.template(xhrGetRequestBody)
  )
  Handlebars.registerPartial(
    "xhr/getResponseBody",
    Handlebars.template(xhrGetResponseBody)
  )
  Handlebars.registerPartial(
    "xhr/getResponseHeader",
    Handlebars.template(xhrGetResponseHeader)
  )
  Handlebars.registerPartial(
    "xhr/sendRequest",
    Handlebars.template(xhrSendRequest)
  )
  Handlebars.registerPartial("xhr/request", Handlebars.template(xhrRequest))

  // Specific files for the node client implementation
  Handlebars.registerPartial(
    "node/getHeaders",
    Handlebars.template(nodeGetHeaders)
  )
  Handlebars.registerPartial(
    "node/getRequestBody",
    Handlebars.template(nodeGetRequestBody)
  )
  Handlebars.registerPartial(
    "node/getResponseBody",
    Handlebars.template(nodeGetResponseBody)
  )
  Handlebars.registerPartial(
    "node/getResponseHeader",
    Handlebars.template(nodeGetResponseHeader)
  )
  Handlebars.registerPartial(
    "node/sendRequest",
    Handlebars.template(nodeSendRequest)
  )
  Handlebars.registerPartial("node/request", Handlebars.template(nodeRequest))

  // Specific files for the axios client implementation
  Handlebars.registerPartial(
    "axios/getHeaders",
    Handlebars.template(axiosGetHeaders)
  )
  Handlebars.registerPartial(
    "axios/getRequestBody",
    Handlebars.template(axiosGetRequestBody)
  )
  Handlebars.registerPartial(
    "axios/getResponseBody",
    Handlebars.template(axiosGetResponseBody)
  )
  Handlebars.registerPartial(
    "axios/getResponseHeader",
    Handlebars.template(axiosGetResponseHeader)
  )
  Handlebars.registerPartial(
    "axios/sendRequest",
    Handlebars.template(axiosSendRequest)
  )
  Handlebars.registerPartial("axios/request", Handlebars.template(axiosRequest))

  return templates
}
