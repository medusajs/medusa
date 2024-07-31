import { FormattingOptionsType } from "types"
import authProviderOptions from "./auth-provider.js"
import fileOptions from "./file.js"
import fulfillmentProviderOptions from "./fulfillment-provider.js"
import helperStepsOptions from "./helper-steps.js"
import medusaConfigOptions from "./medusa-config.js"
import medusaOptions from "./medusa.js"
import notificationOptions from "./notification.js"
import paymentProviderOptions from "./payment-provider.js"
import searchOptions from "./search.js"
import taxProviderOptions from "./tax-provider.js"
import workflowsOptions from "./workflows.js"
import dmlOptions from "./dml.js"

const mergerCustomOptions: FormattingOptionsType = {
  ...authProviderOptions,
  ...dmlOptions,
  ...fileOptions,
  ...fulfillmentProviderOptions,
  ...helperStepsOptions,
  ...medusaConfigOptions,
  ...medusaOptions,
  ...notificationOptions,
  ...paymentProviderOptions,
  ...searchOptions,
  ...taxProviderOptions,
  ...workflowsOptions,
}

export default mergerCustomOptions
