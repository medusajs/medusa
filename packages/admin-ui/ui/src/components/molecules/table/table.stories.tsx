import { ComponentMeta } from "@storybook/react"
import React from "react"
import Table from "./index"
import TableSearch from "./table-search"
import FilteringOption from "./filtering-option"

export default {
  title: "Molecules/Table",
  component: FilteringOption,
} as ComponentMeta<typeof FilteringOption>

const FilteringTemplate = (args) => <FilteringOption {...args} />
const TableSearchTemplate = (args) => <TableSearch {...args} />
const TableTemplate = (args) => (
  <Table>
    <Table.Head>
      <Table.HeadRow>
        <Table.HeadCell>Column 1</Table.HeadCell>
        <Table.HeadCell>Column 2</Table.HeadCell>
        <Table.HeadCell>Column 3</Table.HeadCell>
        <Table.HeadCell>Column 4</Table.HeadCell>
        <Table.HeadCell>Column 5</Table.HeadCell>
      </Table.HeadRow>
    </Table.Head>
    <Table.Body>
      <Table.Row {...args}>
        <Table.Cell>value 1</Table.Cell>
        <Table.Cell>value 2</Table.Cell>
        <Table.Cell>value 3</Table.Cell>
        <Table.Cell>value 4</Table.Cell>
        <Table.Cell>value 5</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
)

const TableWithFilterAndSearchTemplate = (args) => (
  <Table
    filteringOptions={[
      {
        title: "test options",
        options: [
          { title: "All", count: 3, onClick: () => console.log("all clicked") },
          {
            title: "test option 1",
            count: 3,
            onClick: () => console.log("all clicked"),
          },
          {
            title: "test option 2",
            count: 0,
            onClick: () => console.log("all clicked"),
          },
        ],
      },
      {
        title: "test options",
        options: [
          { title: "All", count: 3, onClick: () => console.log("all clicked") },
          {
            title: "test option 1",
            count: 3,
            onClick: () => console.log("all clicked"),
          },
          {
            title: "test option 2",
            count: 0,
            onClick: () => console.log("all clicked"),
          },
        ],
      },
    ]}
    enableSearch
    handleSearch={console.log}
  >
    <Table.Head>
      <Table.HeadRow>
        <Table.HeadCell>Column 1</Table.HeadCell>
        <Table.HeadCell>Column 2</Table.HeadCell>
        <Table.HeadCell>Column 3</Table.HeadCell>
        <Table.HeadCell>Column 4</Table.HeadCell>
        <Table.HeadCell>Column 5</Table.HeadCell>
      </Table.HeadRow>
    </Table.Head>
    <Table.Body>
      <Table.Row {...args}>
        <Table.Cell>value 1</Table.Cell>
        <Table.Cell>value 2</Table.Cell>
        <Table.Cell>value 3</Table.Cell>
        <Table.Cell>value 4</Table.Cell>
        <Table.Cell>value 5</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
)

export const TableComponent = TableTemplate.bind({})
TableComponent.args = {}

export const TableComponentWithFilteringAndSearch = TableWithFilterAndSearchTemplate.bind(
  {}
)
TableComponentWithFilteringAndSearch.args = {}

export const TableComponentWithActionableRows = TableTemplate.bind({})
TableComponentWithActionableRows.args = {
  actions: [
    { label: "action 1", onClick: () => console.log("clicked action 1") },
    { label: "action 2", onClick: () => console.log("clicked action 2") },
  ],
}

export const TableComponentWithLinkRows = TableTemplate.bind({})
TableComponentWithLinkRows.args = {
  linkTo: "https://google.com",
}

export const TableSearchField = TableSearchTemplate.bind({})
TableSearchField.args = {
  onSeach: (value) => console.log(value),
  placeholder: "Search value",
}

export const FilteringOptions = FilteringTemplate.bind({})
FilteringOptions.args = {
  title: "test options",
  options: [
    { title: "All", count: 3, onClick: () => console.log("all clicked") },
    {
      title: "test option 1",
      count: 3,
      onClick: () => console.log("all clicked"),
    },
    {
      title: "test option 2",
      count: 0,
      onClick: () => console.log("all clicked"),
    },
  ],
}
