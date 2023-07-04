import { Meta } from "@storybook/react"
import React from "react"
import { useRegion, useRegions } from "../src"
import Layout from "./components/Layout"

const Regions = ({ showHookData }) => {
  const data = useRegions()
  return (
    <Layout showHookData={showHookData} data={data}>
      <h3>Regions</h3>
      <ul>
        {data?.regions?.map((region) => (
          <li key={region.id}>{region.name}</li>
        ))}
      </ul>
    </Layout>
  )
}

const Region = ({ showHookData, id }) => {
  const data = useRegion(id)
  return (
    <Layout showHookData={showHookData} data={data}>
      <h3>Region: {id}</h3>
      <div>
        {data?.region?.name} - {data?.region?.currency_code}
      </div>
    </Layout>
  )
}

const meta: Meta = {
  title: "Regions",
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

export const List = (args: { showHookData: boolean }) => <Regions {...args} />

export const GetOne = (args: { showHookData: boolean; id: string }) => (
  <Region {...args} />
)

GetOne.argTypes = {
  id: {
    control: {
      type: "text",
    },
    name: "region id",
    defaultValue: "reg_",
  },
}
