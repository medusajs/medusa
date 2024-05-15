import { FormattingOptionsType } from "types"
import fileOptions from "./file.js"
import jsClientOptions from "./js-client.js"
import medusaConfigOptions from "./medusa-config.js"
import medusaReactOptions from "./medusa-react.js"
import medusaOptions from "./medusa.js"
import notificationOptions from "./notification.js"
import paymentProviderOptions from "./payment-provider.js"
import searchOptions from "./search.js"
import taxProviderOptions from "./tax-provider.js"
import workflowsOptions from "./workflows.js"

const mergerCustomOptions: FormattingOptionsType = {
  ...fileOptions,
  ...jsClientOptions,
  ...medusaConfigOptions,
  ...medusaReactOptions,
  ...medusaOptions,
  ...notificationOptions,
  ...paymentProviderOptions,
  ...searchOptions,
  ...taxProviderOptions,
  ...workflowsOptions,
}

export default mergerCustomOptions
