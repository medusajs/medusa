import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const headingProps: PropDataMap = [
  {
    prop: "level",
    type: {
      type: "enum",
      values: ["h1", "h2", "h3"],
    },
    defaultValue: "h1",
  },
]

const Props = () => {
  return <PropTable props={headingProps} />
}

export default Props
