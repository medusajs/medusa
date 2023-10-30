import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const selectItemProps: PropDataMap = [
  {
    prop: "value",
    type: "string",
    defaultValue: undefined,
  },
]

const Props = () => {
  return <PropTable props={selectItemProps} />
}

export default Props
