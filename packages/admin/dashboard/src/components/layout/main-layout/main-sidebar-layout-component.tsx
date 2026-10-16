import { clx } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { LayoutComponentProps } from "../../layout-composer/types"
import {
  CollapsibleGroup,
  CollapsibleGroups,
  hasContent,
} from "../collapsible-group"

/**
 * Sections rendered as collapsible groups, in display order. A group with no
 * visible entries is not rendered (it stays available as a drop target while
 * the sidebar is being customized).
 */
const GROUPS = [
  { id: "sales", labelKey: "app.nav.main.groups.sales" },
  { id: "catalog", labelKey: "app.nav.main.groups.catalog" },
  { id: "customers", labelKey: "app.nav.main.groups.customers" },
  { id: "marketing", labelKey: "app.nav.main.groups.marketing" },
  { id: "extensions", labelKey: "app.nav.common.extensions" },
] as const

export const MainSidebarLayoutComponent = ({
  sections,
  className,
}: LayoutComponentProps) => {
  const { t } = useTranslation()

  return (
    <div className={clx("flex flex-1 flex-col", className)}>
      {hasContent(sections["top"]) && (
        <div className="flex flex-col gap-y-0.5 px-3 pt-3">
          {sections["top"]}
        </div>
      )}
      <CollapsibleGroups>
        {GROUPS.filter((group) => hasContent(sections[group.id])).map(
          (group) => (
            <CollapsibleGroup key={group.id} label={t(group.labelKey)}>
              {sections[group.id]}
            </CollapsibleGroup>
          )
        )}
      </CollapsibleGroups>
    </div>
  )
}
