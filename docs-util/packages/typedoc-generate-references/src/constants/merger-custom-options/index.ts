import { FormattingOptionsType } from "types"
import fileOptions from "./file.js"
import fulfillmentOptions from "./fulfillment.js"
import jsClientOptions from "./js-client.js"
import medusaConfigOptions from "./medusa-config.js"
import medusaReactOptions from "./medusa-react.js"
import medusaOptions from "./medusa.js"
import notificationOptions from "./notification.js"
import paymentProcessorOptions from "./payment-processor.js"
import paymentProviderOptions from "./payment-provider.js"
import priceSelectionOptions from "./price-selection.js"
import searchOptions from "./search.js"
import servicesOptions from "./services.js"
import taxCalculationOptions from "./tax-calculation.js"
import taxProviderOptions from "./tax-provider.js"
import taxServicesOptions from "./tax-services.js"
import workflowsOptions from "./workflows.js"
import entitiesOptions from "./entities.js"

const mergerCustomOptions: FormattingOptionsType = {
  ...entitiesOptions,
  ...fileOptions,
  ...fulfillmentOptions,
  ...jsClientOptions,
  ...medusaConfigOptions,
  ...medusaReactOptions,
  ...medusaOptions,
  ...notificationOptions,
  ...paymentProcessorOptions,
  ...paymentProviderOptions,
  ...priceSelectionOptions,
  ...searchOptions,
  ...servicesOptions,
  ...taxCalculationOptions,
  ...taxProviderOptions,
  ...taxServicesOptions,
  ...workflowsOptions,
}

export default mergerCustomOptions
