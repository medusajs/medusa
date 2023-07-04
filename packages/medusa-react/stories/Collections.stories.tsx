import { Meta } from "@storybook/react"
import React from "react"
import { useCollection, useCollections } from "../src"
import Layout from "./components/Layout"

const Collections = ({ showHookData, limit, offset }) => {
  const data = useCollections({ limit, offset })
  return (
    <Layout showHookData={showHookData} data={data}>
      <h3>Collections</h3>
      <ul>
        {data?.collections?.map((Collection) => (
          <li key={Collection.id}>{Collection.title}</li>
        ))}
      </ul>
    </Layout>
  )
}

const Collection = ({ showHookData, id }) => {
  const data = useCollection(id)
  return (
    <Layout showHookData={showHookData} data={data}>
      <h3>Collection: {id}</h3>
      <div>
        {data?.collection?.title} - {data?.collection?.handle}
      </div>
    </Layout>
  )
}

const meta: Meta = {
  title: "Collections",
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
}) => <Collections {...args} />

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
  <Collection {...args} />
)

GetOne.argTypes = {
  id: {
    control: {
      type: "text",
    },
    name: "Collection id",
    defaultValue: "pcol_",
  },
}
