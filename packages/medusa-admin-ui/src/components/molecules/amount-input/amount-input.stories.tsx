import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import AmountAndCurrencyInput from "./amount-and-currency-input"
import AmountInput from "./amount-input"

export default {
  title: "Molecules/AmountInput/AmountInput",
  component: AmountAndCurrencyInput,
} as ComponentMeta<typeof AmountInput>

const Template: ComponentStory<typeof AmountInput> = (props) => {
  const [value, setValue] = React.useState<number | undefined | null>(1000)

  return (
    <div className="w-[280px]">
      <AmountInput
        {...props}
        onChange={setValue}
        value={value}
        currencyCode="usd"
      />
      <div className="mt-base rounded-rounded bg-grey-5 py-xsmall px-small">
        <pre className="mono-small-regular">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export const Amount = Template.bind({})
Amount.args = {
  label: "Price",
}
