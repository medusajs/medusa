import { HookTable } from "@/components/hook-table"
import { HookDataMap } from "@/types/hooks"

const useToastValues: HookDataMap = [
  {
    value: "dialog",
    type: {
      type: "function",
      signature: `async (props: PromptProps): Promise<boolean>`,
    },
    description: "Async function used to display a new confirmation dialog.",
  },
]

const Props = () => {
  return <HookTable props={useToastValues} />
}

export default Props
