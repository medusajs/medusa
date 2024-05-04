import { Checkbox, Label } from "@medusajs/ui"

export default function CheckboxDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="billing-shipping" />
      <Label htmlFor="billing-shipping">
        Billing address same as shipping address
      </Label>
    </div>
  )
}
