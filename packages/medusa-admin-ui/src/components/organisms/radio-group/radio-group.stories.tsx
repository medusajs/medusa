import { storiesOf } from "@storybook/react"
import React from "react"
import useState from "storybook-addon-state"
import RadioGroup from "."

const values = [
  {
    id: "1",
    name: "Americas",
    countries: [
      { display_name: "United States" },
      { display_name: "Canada" },
      { display_name: "Mexico" },
    ],
    description:
      "Payment providers: not configured - Fulfillment providers: not configured",
  },
  {
    id: "2",
    name: "Europe",
    countries: [
      { display_name: "United Kingdom" },
      { display_name: "France" },
      { display_name: "Germany" },
      { display_name: "Italy" },
      { display_name: "Spain" },
      { display_name: "Switzerland" },
    ],
    description:
      "Payment providers: not configured - Fulfillment providers: not configured",
  },
]

let val = "1"

storiesOf("Organisms/RadioGroup", module).add("controlled", () => {
  const [value, setValue] = useState("value", val)

  return (
    <RadioGroup.Root value={value} onValueChange={(v) => setValue(v)}>
      {values.map((value) => {
        return (
          <RadioGroup.Item
            key={value.id}
            value={value.id}
            label={value.name}
            sublabel={`(${value.countries
              .map((c) => c.display_name)
              .join(", ")})`}
            description={value.description}
          />
        )
      })}
    </RadioGroup.Root>
  )
})

const Template = (args) => (
  <div>
    <RadioGroup.Root {...args}>
      {values.map((value) => {
        return (
          <RadioGroup.Item
            key={value.id}
            value={value.id}
            label={value.name}
            description={value.description}
          />
        )
      })}
    </RadioGroup.Root>
  </div>
)

export const Default = Template.bind({})
Default.args = {
  value: val,
  onValueChange: (v) => {
    val = v
  },
}
