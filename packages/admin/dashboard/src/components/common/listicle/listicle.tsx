import { Text } from "@zjedene-medusa/ui"
import { ReactNode } from "react"

export interface ListicleProps {
  labelKey: string
  descriptionKey: string
  children?: ReactNode
}

export const Listicle = ({
  labelKey,
  descriptionKey,
  children,
}: ListicleProps) => {
  return (
    <div className="flex flex-col gap-2 px-2 pb-2">
      <div className="shadow-elevation-card-rest bg-ui-bg-component transition-fg hover:bg-ui-bg-component-hover active:bg-ui-bg-component-pressed group-focus-visible:shadow-borders-interactive-with-active rounded-md px-4 py-2">
        <div className="flex items-center gap-4">
          <div className="flex flex-1 flex-col">
            <Text size="small" leading="compact" weight="plus">
              {labelKey}
            </Text>
            <Text size="small" leading="compact" className="text-ui-fg-subtle">
              {descriptionKey}
            </Text>
          </div>
          <div className="flex size-7 items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
