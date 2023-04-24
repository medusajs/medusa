import { ComponentMeta } from "@storybook/react"
import React from "react"
import ShippingOption from "."

export default {
  title: "Atoms/ShippingOption",
  component: ShippingOption,
} as ComponentMeta<typeof ShippingOption>

const Template = args => <ShippingOption {...args} />

export const FlatRate = Template.bind({})
FlatRate.args = {
  option: {
    name: "Standard",
    amount: 1000,
    price_type: "flat_rate",
    requirements: [
      { type: "max_subtotal", amount: 10000 },
      { type: "min_subtotal", amount: 0 },
    ],
    admin_only: false,
    data: {
      name: "FedEx",
    },
  },
  currency_code: "USD",
  editFn: () => {},
}

export const CalculatedRate = Template.bind({})
CalculatedRate.args = {
  option: {
    name: "Standard",
    amount: 1000,
    price_type: "calculated",
    requirements: [
      { type: "max_subtotal", amount: 10000 },
      { type: "min_subtotal", amount: 0 },
    ],
    admin_only: false,
    data: {
      name: "FedEx",
    },
  },
  currency_code: "USD",
  editFn: () => {},
}

export const AdminOnly = Template.bind({})
AdminOnly.args = {
  option: {
    name: "Standard",
    amount: 1000,
    price_type: "calculated",
    requirements: [],
    admin_only: true,
    data: {
      name: "FedEx",
    },
  },
  currency_code: "USD",
  editFn: () => {},
}
