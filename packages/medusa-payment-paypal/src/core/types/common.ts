export type Links = { href: string; rel: string; method: string }[]

export interface Address {
  country_code: string
  address_line_1?: string
  address_line_2?: string
  admin_area_1?: string
  admin_area_2?: string
  postal_code?: string
}

export interface MoneyAmount {
  value: string | number
  currency_code: string
}

export interface MoneyBreakdown {
  discount: MoneyAmount
  handling: MoneyAmount
  insurance: MoneyAmount
  item_total: MoneyAmount
  shipping: MoneyAmount
  shipping_discount: MoneyAmount
  tax_total: MoneyAmount
}

export interface PaymentInstruction {
  disbursement_mode: "INSTANT" | "DELAYED"
  payee_pricing_tier_id: string
  payee_receivable_fx_rate_id: string
  platform_fees: Array<PlatformFee>
}

export interface Payee {
  email_address: string
  merchant_id: string
}

export interface PlatformFee {
  amount: MoneyAmount
  payee: Payee
}

export interface PurchaseUnitItem {
  name: string
  quantity: number
  unit_amount: MoneyAmount
  category?: "DIGITAL_GOODS" | "PHYSICAL_GOODS" | "DONATION"
  description?: string
  sku?: string
  tax?: MoneyAmount
}

export interface PurchaseUnit {
  amount: MoneyAmount | MoneyBreakdown
  custom_id?: string
  description?: string
  invoice_id?: string
  items?: Array<PurchaseUnitItem>
  payee?: Payee
  payment_instruction?: PaymentInstruction
  reference_id?: string
  shipping?: {
    address?: Address
    name?: { full_name: string }
    type?: "SHIPPING" | "PICKUP_IN_PERSON"
  }
  soft_descriptor?: string
}

export interface ExperienceContext {
  brand_name?: string
  cancel_url?: string
  locale?: string
  return_url?: string
  shipping_preference?: "GET_FROM_FILE" | "NO_SHIPPING" | "SET_PROVIDED_ADDRESS"
}

export interface PaymentSourceBase {
  name: string
  country_name: string
  experience_context?: ExperienceContext
}

/* eslint @typescript-eslint/no-empty-interface: "off" */
export interface Bancontact extends PaymentSourceBase {}

export interface Blik extends PaymentSourceBase {
  email?: string
}

export interface Card {
  billing_address?: Address
  expiry?: string
  name?: string
  number?: string
  security_code?: string
  stored_credential?: {
    payment_initiator: "CUSTOMER" | "MERCHANT"
    payment_type: "ONE_TIME" | "RECURRING" | "UNSCHEDULED"
    previous_network_transaction_reference?: {
      id: string
      network:
        | "VISA"
        | "MASTERCARD"
        | "DISCOVER"
        | "AMEX"
        | "SOLO"
        | "JCB"
        | "STAR"
        | "DELTA"
        | "SWITCH"
        | "MAESTRO"
        | "CB_NATIONALE"
        | "CONFIGOGA"
        | "CONFIDIS"
        | "ELECTRON"
        | "CETELEM"
        | "CHINA_UNION_PAY"
      date?: string
    }
    usageenum?: "FIRST" | "SUBSEQUENT" | "DERIVED"
  }
  vault_id?: string
}

/* eslint @typescript-eslint/no-empty-interface: "off" */
export interface EPS extends PaymentSourceBase {}

/* eslint @typescript-eslint/no-empty-interface: "off" */
export interface Giropay extends PaymentSourceBase {}

export interface Ideal extends PaymentSourceBase {
  bic?: string
}

/* eslint @typescript-eslint/no-empty-interface: "off" */
export interface MyBank extends PaymentSourceBase {}

export interface P24 extends PaymentSourceBase {
  email: string
}

export interface Paypal {
  address?: Address
  birth_date?: string
  email_address?: string
  experience_context?: ExperienceContext
}

/* eslint @typescript-eslint/no-empty-interface: "off" */
export interface Sofort extends PaymentSourceBase {}

export interface Token {
  id: string
  type: "BILLING_AGREEMENT"
}

export interface Trustly {
  bic?: string
  country_code?: string
  iban_last_chars?: string
  name?: string
}

export interface PaymentSource {
  bancontact?: Bancontact
  blik?: Blik
  card?: Card
  eps?: EPS
  ideal?: Ideal
  myBank?: MyBank
  p24?: P24
  paypal?: Paypal
  sofort?: Sofort
  token?: Token
  trustly?: Trustly
}
