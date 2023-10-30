import { CurrencyInput } from "@medusajs/ui"

export default function CurrencyInputBase() {
  return (
    <div className="max-w-[250px]">
      <CurrencyInput size="base" symbol="$" code="usd" />
    </div>
  )
}
