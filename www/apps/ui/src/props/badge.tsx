import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const badgeProps: PropDataMap = [
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
    prop: "type",
    type: {
      type: "enum",
      values: ["default", "rounded", "icon"],
    },
    defaultValue: "default",
  },
]

const Props = () => {
  return <PropTable props={badgeProps} />
}

export default Props
