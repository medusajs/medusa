import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const currencyInputProps: PropDataMap = [
  {
    prop: "symbol",
    type: "string",
  },
  {
    prop: "code",
    type: "string",
  },
]

const Props = () => {
  return <PropTable props={currencyInputProps} />
}

export default Props
