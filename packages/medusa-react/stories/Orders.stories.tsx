import { Meta } from "@storybook/react"
import React from "react"
import { useCartOrder, useOrder, useProduct, useProducts } from "../src"
import Layout from "./components/Layout"

const CartOrderComponent = ({ showHookData, cartId }) => {
  const data = useCartOrder(cartId)
  return (
    <Layout showHookData={showHookData} data={data}>
      <h3>Order from cart with id: {cartId}</h3>
      <div>
        {data?.order?.email} - {data?.order?.currency_code}
      </div>
    </Layout>
  )
}

const Order = ({ showHookData, id }) => {
  const data = useOrder(id)
  return (
    <Layout showHookData={showHookData} data={data}>
      <h3>Order: {id}</h3>
      <div>
        {data?.order?.email} - {data?.order?.currency_code}
      </div>
    </Layout>
  )
}

const meta: Meta = {
  title: "Orders",
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

export const CartOrder = (args: { cartId: string; showHookData: boolean }) => (
  <CartOrderComponent {...args} />
)

CartOrder.argTypes = {
  cartId: {
    control: {
      type: "text",
    },
    name: "cart id",
    defaultValue: "cart_...",
  },
}

export const GetOne = (args: { showHookData: boolean; id: string }) => (
  <Order {...args} />
)

GetOne.argTypes = {
  id: {
    control: {
      type: "text",
    },
    name: "order id",
    defaultValue: "order_...",
  },
}
