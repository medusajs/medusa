import { CreditCard } from "@medusajs/icons"
import Bancontact from "@modules/common/icons/bancontact"
import Ideal from "@modules/common/icons/ideal"
import PayPal from "@modules/common/icons/paypal"
import CashfreeIcon from "@modules/common/icons/cashfree"
import CashOnDeliveryIcon from "@modules/common/icons/cash-on-delivery"
import React from "react"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_cashfree_cashfree: {
    title: "Cashfree (UPI, Cards, NetBanking, Wallets)",
    icon: <CashfreeIcon className="w-6 h-6 rounded" />,
  },
  "pp_cashfree": {
    title: "Cashfree (UPI, Cards, NetBanking, Wallets)",
    icon: <CashfreeIcon className="w-6 h-6 rounded" />,
  },
  pp_system_default: {
    title: "Cash on Delivery (COD) / Direct Pay",
    icon: <CashOnDeliveryIcon className="w-6 h-6" />,
  },
  pp_stripe_stripe: {
    title: "Credit / Debit Card",
    icon: <CreditCard />,
  },
  "pp_medusa-payments_default": {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_stripe-ideal_stripe": {
    title: "iDeal",
    icon: <Ideal />,
  },
  "pp_stripe-bancontact_stripe": {
    title: "Bancontact",
    icon: <Bancontact />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
}

// Check for Cashfree provider
export const isCashfree = (providerId?: string) => {
  return (providerId?.includes("cashfree") || providerId?.startsWith("pp_cashfree")) ?? false
}

// This only checks if it is native stripe or medusa payments for card payments, it ignores the other stripe-based providers
export const isStripeLike = (providerId?: string) => {
  return (
    providerId?.startsWith("pp_stripe_") || providerId?.startsWith("pp_medusa-")
  )
}

export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}

export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default") || providerId === "manual"
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]
