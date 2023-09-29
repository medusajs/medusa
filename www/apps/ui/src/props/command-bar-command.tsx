import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const commandBarCommandProps: PropDataMap = [
  {
    prop: "action",
    type: "function",
  },
  {
    prop: "label",
    type: "string",
  },
  {
    prop: "shortcut",
    type: "string",
  },
]

const Props = () => {
  return <PropTable props={commandBarCommandProps} />
}

export default Props
