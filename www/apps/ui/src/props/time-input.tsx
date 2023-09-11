import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const timeInputProps: PropDataMap = [
  {
    prop: "hourCycle",
    type: {
      type: "enum",
      values: [12, 24],
    },
    defaultValue: undefined,
  },
]

const Props = () => {
  return <PropTable props={timeInputProps} />
}

export default Props
