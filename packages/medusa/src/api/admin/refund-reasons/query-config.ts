export const defaultAdminRefundReasonFields = [
  "id",
  "label",
  "description",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const defaultAdminRetrieveRefundReasonFields = [
  ...defaultAdminRefundReasonFields,
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminRetrieveRefundReasonFields,
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminRefundReasonFields,
  defaultLimit: 20,
  isList: true,
}
