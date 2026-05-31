import type { Metadata } from "next"
import CheckoutClient from "@/components/checkout/CheckoutClient"

export const metadata: Metadata = {
  title: "Checkout | MemoryLane Gifts",
  robots: { index: false },
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
