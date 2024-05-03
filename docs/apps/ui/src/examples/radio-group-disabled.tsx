import { Label, RadioGroup } from "@medusajs/ui"

export default function RadioGroupDisabled() {
  return (
    <RadioGroup>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item value="1" id="radio_1_disabled" />
        <Label htmlFor="radio_1_disabled" weight="plus">
          Radio 1
        </Label>
      </div>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item value="2" id="radio_2_disabled" />
        <Label htmlFor="radio_2_disabled" weight="plus">
          Radio 2
        </Label>
      </div>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item value="3" id="radio_3_disabled" disabled={true} />
        <Label htmlFor="radio_3_disabled" weight="plus">
          Radio 3
        </Label>
      </div>
    </RadioGroup>
  )
}
