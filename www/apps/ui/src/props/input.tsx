import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const inputProps: PropDataMap = [
  {
    prop: "size",
    type: {
      type: "enum",
      values: ["base", "small"],
    },
    defaultValue: "base",
  },
]

const Props = () => {
  return <PropTable props={inputProps} />
}

export default Props
