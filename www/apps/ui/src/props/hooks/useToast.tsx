import { HookTable } from "@/components/hook-table"
import { HookDataMap } from "@/types/hooks"

const useToastValues: HookDataMap = [
  {
    value: "toast",
    type: {
      type: "function",
      signature: `(toast: Omit<ToasterToast, "id">) => {\n  id: string,\n  dismiss: () => void,\n  update: (toast: ToasterToast) => void\n}`,
    },
    description:
      "Function used to display new toasts. For the toast options, please check the ToasterToast reference below.",
  },
  {
    value: "dismiss",
    type: {
      type: "function",
      signature: "(toastId?: string) => void",
    },
    description: "Function used to hide a toast based on its id.",
  },
  {
    value: "toasts",
    type: "ToasterToast[]",
    description:
      "All the toasts that have been pushed to the context this hook was invoked in.",
  },
]

const Props = () => {
  return <HookTable props={useToastValues} />
}

export default Props
