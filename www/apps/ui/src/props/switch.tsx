import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const switchProps: PropDataMap = [
  {
    prop: "size",
    type: {
      type: "enum",
      values: ["small", "base"],
    },
    defaultValue: "base",
  },
]

const Props = () => {
  return <PropTable props={switchProps} />
}

export default Props
