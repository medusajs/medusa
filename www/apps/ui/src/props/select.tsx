import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const selectProps: PropDataMap = [
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
  return <PropTable props={selectProps} />
}

export default Props
