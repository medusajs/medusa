import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const progressTabsTriggerProps: PropDataMap = [
  {
    prop: "status",
    type: {
      type: "enum",
      values: ["not-started", "in-progress", "completed"],
    },
    defaultValue: "not-started",
  },
]

const Props = () => {
  return <PropTable props={progressTabsTriggerProps} />
}

export default Props
