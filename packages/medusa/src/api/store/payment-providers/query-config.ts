import { disallowedStoreFields } from "../utils/disallowed-fields"

export const defaultAdminPaymentProviderFields = ["id", "is_enabled"]

export const listTransformPaymentProvidersQueryConfig = {
  defaults: defaultAdminPaymentProviderFields,
  disallowed: disallowedStoreFields,
  isList: true,
}
