import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const tooltipProps: PropDataMap = [
  {
    prop: "maxWidth",
    type: "number",
    defaultValue: 220,
  },
]

const Props = () => {
  return <PropTable props={tooltipProps} />
}

export default Props
