import { buildAllowedFields } from "../utils/allowed-fields"
import { disallowedStoreFields } from "../utils/disallowed-fields"

export const defaultAdminPaymentProviderFields = ["id", "is_enabled"]

export const listTransformPaymentProvidersQueryConfig = {
  defaults: defaultAdminPaymentProviderFields,
  allowed: buildAllowedFields(defaultAdminPaymentProviderFields),
  disallowed: disallowedStoreFields,
  isList: true,
}
