import { XMarkMini } from "@medusajs/icons"
import { Button, clx } from "@medusajs/ui"
import { Children, PropsWithChildren, createContext, useContext } from "react"
import { useTranslation } from "react-i18next"

type ChipGroupVariant = "base" | "component"

type ChipGroupProps = PropsWithChildren<{
  onClearAll?: () => void
  onRemove?: (index: number) => void
  variant?: ChipGroupVariant
  className?: string
}>

type GroupContextValue = {
  onRemove?: (index: number) => void
  variant: ChipGroupVariant
}

const GroupContext = createContext<GroupContextValue | null>(null)

const useGroupContext = () => {
  const context = useContext(GroupContext)

  if (!context) {
    throw new Error("useGroupContext must be used within a ChipGroup component")
  }

  return context
}

const Group = ({
  onClearAll,
  onRemove,
  variant = "component",
  className,
  children,
}: ChipGroupProps) => {
  const { t } = useTranslation()

  const showClearAll = !!onClearAll && Children.count(children) > 0

  return (
    <GroupContext.Provider value={{ onRemove, variant }}>
      <ul
        role="application"
        className={clx("flex flex-wrap items-center gap-2", className)}
      >
        {children}
        {showClearAll && (
          <li>
            <Button
              size="small"
              variant="transparent"
              type="button"
              onClick={onClearAll}
              className="text-ui-fg-muted active:text-ui-fg-subtle"
            >
              {t("actions.clearAll")}
            </Button>
          </li>
        )}
      </ul>
    </GroupContext.Provider>
  )
}

type ChipProps = PropsWithChildren<{
  index: number
  className?: string
}>

const Chip = ({ index, className, children }: ChipProps) => {
  const { onRemove, variant } = useGroupContext()

  return (
    <li
      className={clx(
        "bg-ui-bg-component shadow-borders-base flex items-center divide-x overflow-hidden rounded-md",
        {
          "bg-ui-bg-component": variant === "component",
          "bg-ui-bg-base-": variant === "base",
        },
        className
      )}
    >
      <span className="txt-compact-small-plus text-ui-fg-subtle flex items-center justify-center px-2 py-1">
        {children}
      </span>
      {!!onRemove && (
        <button
          onClick={() => onRemove(index)}
          type="button"
          className={clx(
            "text-ui-fg-muted active:text-ui-fg-subtle transition-fg flex items-center justify-center p-1",
            {
              "hover:bg-ui-bg-component-hover active:bg-ui-bg-component-pressed":
                variant === "component",
              "hover:bg-ui-bg-base-hover active:bg-ui-bg-base-pressed":
                variant === "base",
            }
          )}
        >
          <XMarkMini />
        </button>
      )}
    </li>
  )
}

export const ChipGroup = Object.assign(Group, { Chip })
