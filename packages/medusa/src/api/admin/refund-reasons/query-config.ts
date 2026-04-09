export enum Entities {
  refund_reason = "refund_reason",
}

export const defaultAdminRefundReasonFields = [
  "id",
  "label",
  "code",
  "description",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const defaultAdminRetrieveRefundReasonFields = [
  ...defaultAdminRefundReasonFields,
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminRetrieveRefundReasonFields,
  isList: false,
  entity: Entities.refund_reason,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminRefundReasonFields,
  defaultLimit: 20,
  isList: true,
  entity: Entities.refund_reason,
}
