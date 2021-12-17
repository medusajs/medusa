import { Meta } from "@storybook/react"
import React from "react"
import { useCartSwap } from "../src"
import Layout from "./components/Layout"

const Swap = ({ showHookData, cartId }) => {
  const data = useCartSwap(cartId)
  return (
    <Layout showHookData={showHookData} data={data}>
      <h3>Cart swap: {cartId}</h3>
      <div>
        {data?.swap?.order_id} - {data?.swap?.cart_id}
      </div>
    </Layout>
  )
}

const meta: Meta = {
  title: "Swaps",
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

export const GetOne = (args: { showHookData: boolean; cartId: string }) => (
  <Swap {...args} />
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
