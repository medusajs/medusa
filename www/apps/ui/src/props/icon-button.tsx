import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const iconButtonProps: PropDataMap = [
  {
    prop: "variant",
    type: {
      type: "enum",
      values: ["primary", "transparent"],
    },
    defaultValue: "primary",
  },
  {
    prop: "size",
    type: {
      type: "enum",
      values: ["base", "large", "xlarge"],
    },
    defaultValue: "base",
  },
  {
    prop: "isLoading",
    type: "boolean",
    defaultValue: false,
  },
]

const Props = () => {
  return <PropTable props={iconButtonProps} />
}

export default Props
