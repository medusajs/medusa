import { Option } from "../types/shared"

const providerDescriptors: { [providerKey: string]: Option } = {
  stripe: {
    label: "Stripe",
    value: "stripe",
  },
  "stripe-ideal": {
    label: "Stripe Ideal",
    value: "stripe-ideal",
  },
  "stripe-giropay": {
    label: "Stripe Giropay",
    value: "stripe-giropay",
  },
  "stripe-bancontact": {
    label: "Stripe Bancontact",
    value: "stripe-bancontact",
  },
  "stripe-przelewy24": {
    label: "Stripe Przelewy24",
    value: "stripe-przelewy24",
  },
  "stripe-blik": {
    label: "Stripe Blik",
    value: "stripe-blik",
  },
  "mobilepay-adyen": {
    label: "MobilePay via Adyen",
    value: "mobilepay-adyen",
  },
  "scheme-adyen": {
    label: "Cards via Adyen",
    value: "scheme-adyen",
  },
  "klarna-adyen": {
    label: "Klarna via Adyen",
    value: "klarna-adyen",
  },
  klarna: {
    label: "Klarna",
    value: "klarna",
  },
  "paywithgoogle-adyen": {
    label: "GooglePay via Adyen",
    value: "paywithgoogle-adyen",
  },
  "applepay-adyen": {
    label: "ApplePay via Adyen",
    value: "applepay-adyen",
  },
  "paypal-adyen": {
    label: "PayPal via Adyen",
    value: "paypal-adyen",
  },
  "ideal-adyen": {
    label: "iDEAL via Adyen",
    value: "ideal-adyen",
  },
  manual: {
    label: "Manual",
    value: "manual",
  },
}

export default function (provider: string): Option {
  return (
    providerDescriptors[provider] ?? {
      label: provider,
      value: provider,
    }
  )
}
