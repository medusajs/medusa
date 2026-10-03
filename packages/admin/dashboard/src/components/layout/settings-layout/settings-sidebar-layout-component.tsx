import { clx } from "@medusajs/ui"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import { LayoutComponentProps } from "../../layout-composer/types"
import {
  CollapsibleGroup,
  GroupDivider,
  hasContent,
} from "../collapsible-group"

export const SettingsSidebarLayoutComponent = ({
  sections,
  className,
}: LayoutComponentProps) => {
  const { t } = useTranslation()

  return (
    <div className={clx("flex flex-1 flex-col", className)}>
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
