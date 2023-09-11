import { HookTable } from "@/components/hook-table"
import { HookDataMap } from "@/types/hooks"

const PromptPropsValues: HookDataMap = [
  {
    value: "title",
    type: "string",
  },
  {
    value: "description",
    type: "string",
  },
  {
    value: "verificationText",
    type: "string",
    description: "Text the user has to input in order to confirm the action",
  },
  {
    value: "cancelText",
    type: "string",
    description: `Label for the Cancel button. Defaults to "Cancel".`,
  },
  {
    value: "confirmText",
    type: "string",
    description: `Label for the Confirm button. Defaults to "Confirm".`,
  },
]

const Props = () => {
  return <HookTable props={PromptPropsValues} />
}

export default Props
