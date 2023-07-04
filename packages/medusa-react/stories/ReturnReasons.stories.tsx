import { Meta } from "@storybook/react"
import React from "react"
import { useReturnReason, useReturnReasons } from "../src"
import Layout from "./components/Layout"

const ReturnReasons = ({ showHookData }) => {
  const data = useReturnReasons()
  return (
    <Layout showHookData={showHookData} data={data}>
      <h3>Return Reasons</h3>
      <ul>
        {data?.return_reasons?.map((rr) => (
          <li key={rr.id}>
            {rr.label} - {rr.value}
          </li>
        ))}
      </ul>
    </Layout>
  )
}

const ReturnReason = ({ showHookData, id }) => {
  const data = useReturnReason(id)
  return (
    <Layout showHookData={showHookData} data={data}>
      <h3>Return Reason: {id}</h3>
      <div>
        {data?.return_reason?.label} - {data?.return_reason?.value}
      </div>
    </Layout>
  )
}

const meta: Meta = {
  title: "Return Reasons",
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

export const List = (args: { showHookData: boolean }) => (
  <ReturnReasons {...args} />
)

export const GetOne = (args: { showHookData: boolean; id: string }) => (
  <ReturnReason {...args} />
)

GetOne.argTypes = {
  id: {
    control: {
      type: "text",
    },
    name: "return reason id",
    defaultValue: "rr_...",
  },
}
