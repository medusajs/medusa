import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const codeBlockHeaderProps: PropDataMap = [
  {
    prop: "hideLabels",
    type: "boolean",
    defaultValue: false,
  },
]

const Props = () => {
  return <PropTable props={codeBlockHeaderProps} />
}

export default Props
