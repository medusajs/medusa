import { HookTable } from "@/components/hook-table"
import { HookDataMap } from "@/types/hooks"

const useToggleStateValues: HookDataMap = [
  {
    value: "state",
    type: "boolean",
  },
  {
    value: "open",
    type: {
      type: "function",
      signature: "() => void",
    },
  },
  {
    value: "close",
    type: {
      type: "function",
      signature: "() => void",
    },
  },
  {
    value: "toggle",
    type: {
      type: "function",
      signature: "() => void",
    },
  },
]

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
