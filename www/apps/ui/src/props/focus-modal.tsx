import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const focusModalProps: PropDataMap = [
  {
    prop: "defaultOpen",
    type: "boolean",
  },
  {
    prop: "open",
    type: "boolean",
  },
  {
    prop: "onOpenChange",
    type: {
      type: "function",
      signature: `(open: boolean) => void`,
    },
  },
]

const Props = () => {
  return <PropTable props={focusModalProps} />
}

export default Props
