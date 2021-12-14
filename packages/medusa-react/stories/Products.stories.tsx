import { Meta } from "@storybook/react"
import React from "react"
import { useProduct, useProducts } from "../src"
import Layout from "./components/Layout"

const Products = ({ showHookData, limit, offset }) => {
  const data = useProducts({ limit, offset })
  return (
    <Layout showHookData={showHookData} data={data}>
      <h3>Products</h3>
      <ul>
        {data?.products?.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
    </Layout>
  )
}

const Product = ({ showHookData, id }) => {
  const data = useProduct(id)
  return (
    <Layout showHookData={showHookData} data={data}>
      <h3>Product: {id}</h3>
      <div>
        {data?.product?.title} - {data?.product?.handle}
      </div>
    </Layout>
  )
}

const meta: Meta = {
  title: "Products",
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

export const List = (args: {
  limit: number
  offset: number
  showHookData: boolean
}) => <Products {...args} />

List.argTypes = {
  limit: {
    control: {
      type: "number",
    },
    name: "limit",
    defaultValue: 5,
  },
  offset: {
    control: {
      type: "number",
    },
    defaultValue: 0,
  },
}

export const GetOne = (args: { showHookData: boolean; id: string }) => (
  <Product {...args} />
)

GetOne.argTypes = {
  id: {
    control: {
      type: "text",
    },
    name: "product id",
    defaultValue: "prod_",
  },
}
