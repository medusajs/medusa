import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const iconBadgeProps: PropDataMap = [
  {
    prop: "color",
    type: {
      type: "enum",
      values: ["green", "red", "blue", "orange", "grey", "purple"],
    },
    defaultValue: "grey",
  },
  {
    prop: "size",
    type: {
      type: "enum",
      values: ["small", "base", "large"],
    },
    defaultValue: "base",
  },
  {
    prop: "rounded",
    type: {
      type: "enum",
      values: ["base", "rounded"],
    },
    defaultValue: "base",
  },
]

const Props = () => {
  return <PropTable props={iconBadgeProps} />
}

export default Props
