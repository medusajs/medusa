import { HookTable } from "@/components/hook-table"
import { HookDataMap } from "@/types/hooks"

const useToggleStateValuesArray: HookDataMap = [
  {
    value: "state",
    type: {
      type: "object",
      name: "StateData",
      shape:
        "[\n  state: boolean,\n  open: () => void,\n  close: () => void,\n  toggle: () => void\n]",
    },
  },
]

const Props = () => {
  return <HookTable props={useToggleStateValuesArray} />
}

export default Props
