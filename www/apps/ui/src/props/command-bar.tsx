import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const commandBarProps: PropDataMap = [
  {
    prop: "open",
    type: "boolean",
    defaultValue: false,
  },
]

const Props = () => {
  return <PropTable props={commandBarProps} />
}

export default Props
