import { Label, Switch } from "@medusajs/ui"

export default function SwitchCheckedDisabled() {
  return (
    <div className="flex items-center gap-x-2">
      <Switch
        id="manage-inventory-checked-disabled"
        checked={true}
        disabled={true}
      />
      <Label htmlFor="manage-inventory-checked-disabled">
        Manage Inventory
      </Label>
    </div>
  )
}
