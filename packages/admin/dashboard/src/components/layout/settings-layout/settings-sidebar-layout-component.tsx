import { MinusMini } from "@medusajs/icons"
import { Divider, IconButton, Text } from "@medusajs/ui"
import { Collapsible as RadixCollapsible } from "radix-ui"
import { Fragment, ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { LayoutComponentProps } from "../../layout-composer/types"

function hasContent(node: ReactNode): boolean {
  return Array.isArray(node) ? node.length > 0 : Boolean(node)
}

const CollapsibleGroup = ({
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

const GroupDivider = () => (
  <div className="flex items-center justify-center px-3">
    <Divider variant="dashed" />
  </div>
)

export const SettingsSidebarLayoutComponent = ({
  sections,
}: LayoutComponentProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 flex-col">
      <CollapsibleGroup label={t("app.nav.settings.general")}>
        {sections["general"]}
      </CollapsibleGroup>
      <GroupDivider />
      <CollapsibleGroup label={t("app.nav.settings.developer")}>
        {sections["developer"]}
      </CollapsibleGroup>
      <GroupDivider />
      <CollapsibleGroup label={t("app.nav.settings.myAccount")}>
        {sections["myAccount"]}
      </CollapsibleGroup>
      {hasContent(sections["extensions"]) && (
        <Fragment>
          <GroupDivider />
          <CollapsibleGroup label={t("app.nav.common.extensions")}>
            {sections["extensions"]}
          </CollapsibleGroup>
        </Fragment>
      )}
    </div>
  )
}
