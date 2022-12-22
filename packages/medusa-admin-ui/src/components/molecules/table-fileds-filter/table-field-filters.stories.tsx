import { ComponentMeta } from "@storybook/react"
import React from "react"
import clsx from "clsx"

import TableFieldsFilters from "./index"

export default {
  title: "Molecules/TableFieldFilters",
  component: TableFieldsFilters,
} as ComponentMeta<typeof TableFieldsFilters>

const Template = (args) => <TableFieldsFilters {...args} />

export const Default = Template.bind({})
Default.args = {
  onChange: console.log,
  fields: [
    {
      id: "p-usd",
      short: "Price USD",
      label: ({ isSelected }) => (
        <span className="text-small text-grey-50">
          <span
            className={clsx("text-grey-90", { "font-semibold": isSelected })}
          >
            USD{" "}
          </span>
          (USA)
        </span>
      ),
    },
    {
      id: "p-dkk",
      short: "Price DKK",
      label: ({ isSelected }) => (
        <span className="text-small text-grey-50">
          <span
            className={clsx("text-grey-90", { "font-semibold": isSelected })}
          >
            DKK{" "}
          </span>
          (Denmark)
        </span>
      ),
    },
    {
      id: "p-hrk",
      short: "Price HRK",
      label: ({ isSelected }) => (
        <span className="text-small text-grey-50">
          <span
            className={clsx("text-grey-90", { "font-semibold": isSelected })}
          >
            HRK{" "}
          </span>
          (Croatia)
        </span>
      ),
    },
  ],
}
