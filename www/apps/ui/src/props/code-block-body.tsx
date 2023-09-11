import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const codeBlockBodyProps: PropDataMap = [
  {
    prop: "hideLineNumbers",
    type: "boolean",
    defaultValue: false,
  },
]

const Props = () => {
  return <PropTable props={codeBlockBodyProps} />
}

export default Props
