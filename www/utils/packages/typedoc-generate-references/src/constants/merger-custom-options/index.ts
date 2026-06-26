import { FormattingOptionsType } from "types"
import authProviderOptions from "./auth-provider.js"
import cachingOptions from "./caching.js"
import fileOptions from "./file.js"
import fulfillmentProviderOptions from "./fulfillment-provider.js"
import helperStepsOptions from "./helper-steps.js"
import medusaOptions from "./medusa.js"
import notificationOptions from "./notification.js"
import paymentProviderOptions from "./payment-provider.js"
import taxProviderOptions from "./tax-provider.js"
import workflowsOptions from "./workflows.js"
import dmlOptions from "./dml.js"
import coreFlowsOptions from "./core-flows.js"
import jsSdkOptions from "./js-sdk.js"
import lockingOptions from "./locking.js"
import cacheOptions from "./cache.js"
import eventOptions from "./event.js"
import fileServiceOptions from "./file-service.js"
import notificationServiceOptions from "./notification-service.js"
import eventsOptions from "./events.js"
import analyticsOptions from "./analytics.js"
import analyticsProviderOptions from "./analytics-provider.js"
import mfaOptions from "./mfa.js"

const mergerCustomOptions: FormattingOptionsType = {
  ...analyticsOptions,
  ...analyticsProviderOptions,
  ...authProviderOptions,
  ...cacheOptions,
  ...cachingOptions,
  ...coreFlowsOptions,
  ...dmlOptions,
  ...eventOptions,
  ...eventsOptions,
  ...fileServiceOptions,
  ...fileOptions,
  ...fulfillmentProviderOptions,
  ...helperStepsOptions,
  ...jsSdkOptions,
  ...lockingOptions,
  ...medusaOptions,
  ...mfaOptions,
  ...notificationServiceOptions,
  ...notificationOptions,
  ...paymentProviderOptions,
  ...taxProviderOptions,
  ...workflowsOptions,
}

export default mergerCustomOptions
