import { Checkbox, Label } from "@medusajs/ui"

export default function CheckboxChecked() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="billing-shipping-checked" checked={true} />
      <Label htmlFor="billing-shipping-checked">
        Billing address same as shipping address
      </Label>
    </div>
  )
}
