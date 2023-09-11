import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const avatarProps: PropDataMap = [
  {
    prop: "variant",
    type: {
      type: "enum",
      values: ["squared", "rounded"],
    },
    defaultValue: "rounded",
  },
  {
    prop: "size",
    type: {
      type: "enum",
      values: ["base", "large"],
    },
    defaultValue: "base",
  },
]

const Props = () => {
  return <PropTable props={avatarProps} />
}

export default Props
