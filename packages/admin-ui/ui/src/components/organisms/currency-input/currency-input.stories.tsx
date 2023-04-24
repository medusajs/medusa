import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import CurrencyInput from "."

export default {
  title: "Organisms/CurrencyInput",
  component: CurrencyInput.Root,
} as ComponentMeta<typeof CurrencyInput.Root>

const Template: ComponentStory<typeof CurrencyInput.Root> = (args) => (
  <CurrencyInput.Root {...args} />
)

export const Default = Template.bind({})
Default.args = {
  currentCurrency: "usd",
  currencyCodes: ["usd", "eur", "gbp"],
}

export const ReadOnly = Template.bind({})
ReadOnly.args = {
  currentCurrency: "usd",
  readOnly: true,
}

const TemplateWithAmount = (args) => (
  <CurrencyInput.Root {...args.currencyArgs}>
    <CurrencyInput.Amount {...args.amountArgs}></CurrencyInput.Amount>
  </CurrencyInput.Root>
)

export const WithAmount = TemplateWithAmount.bind({})
WithAmount.args = {
  currencyArgs: {
    currentCurrency: "usd",
    currencyCodes: ["usd", "eur", "krw"],
    size: "small",
  },
  amountArgs: {
    label: "Price",
    amount: 10000,
  },
}
