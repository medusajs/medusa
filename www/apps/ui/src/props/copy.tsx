import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const copyProps: PropDataMap = [
  {
    prop: "content",
    type: "string",
  },
  {
    prop: "asChild",
    type: "boolean",
    defaultValue: false,
  },
]

const Props = () => {
  return <PropTable props={copyProps} />
}

export default Props
