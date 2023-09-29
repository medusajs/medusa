import { Label, RadioGroup, Text } from "@medusajs/ui"

export default function RadioGroupDescriptions() {
  return (
    <RadioGroup>
      <div className="flex items-start gap-x-3">
        <RadioGroup.Item value="1" id="radio_1_descriptions" />
        <div className="flex flex-col gap-y-0.5">
          <Label htmlFor="radio_1_descriptions" weight="plus">
            Radio 1
          </Label>
          <Text className="text-ui-fg-subtle">
            The quick brown fox jumps over the lazy dog.
          </Text>
        </div>
      </div>
      <div className="flex items-start gap-x-3">
        <RadioGroup.Item value="2" id="radio_2_descriptions" />
        <div className="flex flex-col gap-y-0.5">
          <Label htmlFor="radio_2_descriptions" weight="plus">
            Radio 2
          </Label>
          <Text className="text-ui-fg-subtle">
            The quick brown fox jumps over the lazy dog.
          </Text>
        </div>
      </div>
      <div className="flex items-start gap-x-3">
        <RadioGroup.Item value="3" id="radio_3_descriptions" />
        <div className="flex flex-col gap-y-0.5">
          <Label htmlFor="radio_3_descriptions" weight="plus">
            Radio 3
          </Label>
          <Text className="text-ui-fg-subtle">
            The quick brown fox jumps over the lazy dog.
          </Text>
        </div>
      </div>
    </RadioGroup>
  )
}
