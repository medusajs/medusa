import { Meta } from "@storybook/react"
import React from "react"
import { useGetCart } from "../src"
import Layout from "./components/Layout"

const Cart = ({ showHookData, id }) => {
  const data = useGetCart(id)
  return (
    <Layout showHookData={showHookData} data={data}>
      <h3>Cart: {id}</h3>
      <div>
        {data?.cart?.email} - {data?.cart?.total}
      </div>
    </Layout>
  )
}

const meta: Meta = {
  title: "Carts",
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

export const GetOne = (args: { showHookData: boolean; id: string }) => (
  <Cart {...args} />
)

GetOne.argTypes = {
  id: {
    control: {
      type: "text",
    },
    name: "cart id",
    defaultValue: "cart_...",
  },
}
