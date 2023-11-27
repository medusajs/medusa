import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const statusBadgeProps: PropDataMap = [
  {
    prop: "color",
    type: {
      type: "enum",
      values: ["green", "red", "blue", "orange", "grey", "purple"],
    },
    defaultValue: "grey",
  },
]

const Props = () => {
  return <PropTable props={statusBadgeProps} />
}

export default Props
