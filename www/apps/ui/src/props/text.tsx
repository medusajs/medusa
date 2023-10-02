import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const textProps: PropDataMap = [
  {
    prop: "as",
    type: {
      type: "enum",
      values: ["p", "span", "div"],
    },
    defaultValue: "p",
  },
  {
    prop: "asChild",
    type: "boolean",
    defaultValue: false,
  },
  {
    prop: "size",
    type: {
      type: "enum",
      values: ["xsmall", "small", "base", "large", "large", "xlarge"],
    },
    defaultValue: "base",
  },
  {
    prop: "weight",
    type: {
      type: "enum",
      values: ["regular", "plus"],
    },
    defaultValue: "regular",
  },
  {
    prop: "family",
    type: {
      type: "enum",
      values: ["sans", "mono"],
    },
    defaultValue: "sans",
  },
]

const Props = () => {
  return <PropTable props={textProps} />
}

export default Props
