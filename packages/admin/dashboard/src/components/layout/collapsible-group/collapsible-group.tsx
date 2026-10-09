import { MinusMini } from "@medusajs/icons"
import { Divider, IconButton, Text } from "@medusajs/ui"
import { Collapsible as RadixCollapsible } from "radix-ui"
import { Children, Fragment, ReactNode } from "react"

/**
 * Whether a layout section has anything to render. Sections arrive either as
 * an array of rendered entries or as a single node (e.g. the edit-mode
 * dropzone).
 */
export function hasContent(node: ReactNode): boolean {
  return Array.isArray(node) ? node.length > 0 : Boolean(node)
}

export const CollapsibleGroup = ({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) => {
  return (
    <RadixCollapsible.Root defaultOpen className="py-3">
      <div className="px-3">
        <div className="text-ui-fg-muted flex h-7 items-center justify-between px-2">
          <Text size="small" leading="compact">
            {label}
          </Text>
          <RadixCollapsible.Trigger asChild>
            <IconButton size="2xsmall" variant="transparent" className="static">
              <MinusMini className="text-ui-fg-muted" />
            </IconButton>
          </RadixCollapsible.Trigger>
        </div>
      </div>
      <RadixCollapsible.Content>
        <div className="flex flex-col gap-y-0.5 px-3 pt-0.5">{children}</div>
      </RadixCollapsible.Content>
    </RadixCollapsible.Root>
  )
}

export const GroupDivider = () => (
  <div className="flex items-center justify-center px-3">
    <Divider variant="dashed" />
  </div>
)

/**
 * Renders the given groups separated by dividers.
 */
export const CollapsibleGroups = ({ children }: { children: ReactNode }) => {
  const groups = Children.toArray(children)

  return (
    <>
      {groups.map((group, index) => (
        <Fragment key={index}>
          {index > 0 && <GroupDivider />}
          {group}
        </Fragment>
      ))}
    </>
  )
}
