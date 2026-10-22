import { buildAllowedFields } from "../utils/allowed-fields"

export const defaultAdminPaymentProviderFields = ["id", "is_enabled"]

export const listTransformPaymentProvidersQueryConfig = {
  defaults: defaultAdminPaymentProviderFields,
  allowed: buildAllowedFields(defaultAdminPaymentProviderFields),
  isList: true,
}
