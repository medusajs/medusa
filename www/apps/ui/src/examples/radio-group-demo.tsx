import { Label, RadioGroup } from "@medusajs/ui"

export default function RadioGroupDemo() {
  return (
    <RadioGroup>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item value="1" id="radio_1" />
        <Label htmlFor="radio_1" weight="plus">
          Radio 1
        </Label>
      </div>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item value="2" id="radio_2" />
        <Label htmlFor="radio_2" weight="plus">
          Radio 2
        </Label>
      </div>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item value="3" id="radio_3" />
        <Label htmlFor="radio_3" weight="plus">
          Radio 3
        </Label>
      </div>
    </RadioGroup>
  )
}
