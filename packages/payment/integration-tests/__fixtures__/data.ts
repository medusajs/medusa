export const defaultPaymentCollectionData = [
  {
    id: "pay-col-id-1",
    amount: 100,
    region_id: "region-id-1",
    currency_code: "usd",
  },
  {
    id: "pay-col-id-2",
    amount: 200,
    region_id: "region-id-1",
    currency_code: "usd",
  },
  {
    id: "pay-col-id-3",
    amount: 300,
    region_id: "region-id-2",
    currency_code: "usd",
  },
]

export const defaultPaymentSessionData = [
  {
    id: "pay-sess-id-1",
    amount: 100,
    currency_code: "usd",
    provider_id: "pp_system_default",
    payment_collection_id: "pay-col-id-1",
  },
  {
    id: "pay-sess-id-2",
    amount: 100,
    currency_code: "usd",
    provider_id: "pp_system_default",
    payment_collection_id: "pay-col-id-2",
  },
  {
    id: "pay-sess-id-3",
    amount: 100,
    currency_code: "usd",
    provider_id: "pp_system_default",
    payment_collection_id: "pay-col-id-2",
  },
]

export const defaultPaymentData = [
  {
    id: "pay-id-1",
    amount: 100,
    currency_code: "usd",
    payment_collection_id: "pay-col-id-1",
    payment_session: "pay-sess-id-1",
    provider_id: "pp_system_default",
    authorized_amount: 100,
    data: {},
  },
  {
    id: "pay-id-2",
    amount: 100,
    authorized_amount: 100,
    currency_code: "usd",
    payment_collection_id: "pay-col-id-2",
    payment_session: "pay-sess-id-2",
    provider_id: "pp_system_default",
    data: {},
  },
]
