import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const selectValueProps: PropDataMap = [
  {
    prop: "placeholder",
    type: "string",
    defaultValue: undefined,
  },
]

const Props = () => {
  return <PropTable props={selectValueProps} />
}

export default Props
