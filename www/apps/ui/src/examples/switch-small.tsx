import { Label, Switch } from "@medusajs/ui"

export default function SwitchSmall() {
  return (
    <div className="flex items-center gap-x-2">
      <Switch id="manage-inventory-small" size="small" />
      <Label htmlFor="manage-inventory-small" size="small">
        Manage Inventory
      </Label>
    </div>
  )
}
