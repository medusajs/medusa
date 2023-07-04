import { Meta } from "@storybook/react"
import React from "react"
import { useCartShippingOptions, useShippingOptions } from "../src"
import Layout from "./components/Layout"

const ShippingOptions = ({ showHookData, cartId }) => {
  const data = useShippingOptions(cartId)
  return (
    <Layout showHookData={showHookData} data={data}>
      <h3>Shipping Options</h3>
      <ul>
        {data?.shipping_options?.map((so) => (
          <li key={so.id}>
            {so.name} - {so.amount}
          </li>
        ))}
      </ul>
    </Layout>
  )
}

const CartShippingOptions = ({ showHookData, cartId }) => {
  const data = useCartShippingOptions(cartId)
  return (
    <Layout showHookData={showHookData} data={data}>
      <h3>Cart shipping options: {cartId}</h3>
      <ul>
        {data?.shipping_options?.map((so) => (
          <li key={so.id}>
            {so.name} - {so.amount}
          </li>
        ))}
      </ul>
    </Layout>
  )
}

const meta: Meta = {
  title: "Shipping Options",
  argTypes: {
    showHookData: {
      name: "Show hook data",
      description:
        "Whether or not story should display JSON of data returned from hook",
      control: {
        type: "boolean",
      },
      defaultValue: true,
    },
  },
  parameters: {
    controls: { expanded: true },
  },
}

export default meta

export const List = (args: { showHookData: boolean; cartId: string }) => (
  <ShippingOptions {...args} />
)

List.argTypes = {
  cartId: {
    control: {
      type: "text",
    },
    name: "cart id",
    defaultValue: "cart_...",
  },
}

export const GetOne = (args: { showHookData: boolean; cartId: string }) => (
  <CartShippingOptions {...args} />
)

GetOne.argTypes = {
  cartId: {
    control: {
      type: "text",
    },
    name: "cart id",
    defaultValue: "cart_...",
  },
}
