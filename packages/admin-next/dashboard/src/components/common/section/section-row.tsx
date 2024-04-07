import { Text } from "@medusajs/ui"

export type SectionRowProps = {
  title: string
  value?: React.ReactNode | string | null
  actions?: React.ReactNode
}

export const SectionRow = ({ title, value, actions }: SectionRowProps) => {
  const isValueString = typeof value === "string" || !value

  return (
    <div
      className={`text-ui-fg-subtle grid ${
        !!actions ? "grid-cols-[1fr_1fr_28px]" : "grid-cols-2"
      } items-center px-6 py-4`}
    >
      <Text size="small" weight="plus" leading="compact">
        {title}
      </Text>

      {isValueString ? (
        <Text size="small" leading="compact" className="text-pretty">
          {value ?? "-"}
        </Text>
      ) : (
        <div className="flex flex-wrap gap-1">{value}</div>
      )}

      {actions && <div>{actions}</div>}
    </div>
  )
}
