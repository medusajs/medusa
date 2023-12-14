import { HookTable } from "@/components/hook-table"
import { HookDataMap } from "@/types/hooks"

const ToasterToastValues: HookDataMap = [
  {
    value: "id",
    type: "string",
  },
  {
    value: "title",
    type: "ReactNode",
  },
  {
    value: "description",
    type: "ReactNode",
  },
  {
    value: "variant",
    type: {
      type: "enum",
      values: ["info", "success", "warning", "error", "loading"],
    },
    description: `Defaults to "info"`,
  },
  {
    value: "action",
    type: {
      type: "object",
      name: "ToastActionElement",
      shape:
        "{\n  label: string\n  altText: string\n  onClick: () => void | Promise<void>\n}",
    },
  },
  {
    value: "disableDismiss",
    type: "boolean",
  },
]

const Props = () => {
  return <HookTable props={ToasterToastValues} />
}

export default Props
