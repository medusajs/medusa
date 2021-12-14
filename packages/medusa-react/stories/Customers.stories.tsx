import { Meta } from "@storybook/react"
import React from "react"
import { useMeCustomer, useCustomerOrders } from "../src"
import Layout from "./components/Layout"

const CustomerOrders = ({ showHookData, id }) => {
  const data = useCustomerOrders(id)
  return (
    <Layout showHookData={showHookData} data={data}>
      <h3>Customer Orders</h3>
      <ul>
        {data?.orders?.map((order) => (
          <li key={order.id}>price: {order.total}</li>
        ))}
      </ul>
    </Layout>
  )
}

const Customer = ({ showHookData }) => {
  const data = useMeCustomer()
  return (
    <Layout showHookData={showHookData} data={data}>
      <h3>Customer: </h3>
      <div>
        {data?.customer?.first_name} {data?.customer?.last_name} -{" "}
        {data?.customer?.email}
      </div>
    </Layout>
  )
}

const meta: Meta = {
  title: "Customers",
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

export const ListOrders = (args: { showHookData: boolean; id: string }) => (
  <CustomerOrders {...args} />
)

ListOrders.argTypes = {
  id: {
    control: {
      type: "text",
    },
    name: "customer id",
    defaultValue: "reg_",
  },
}

export const GetOne = (args: { showHookData: boolean }) => (
  <Customer {...args} />
)
