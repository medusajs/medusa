import { InjectionZone } from "@medusajs/admin-shared"
import { PuzzleSolid } from "@medusajs/icons"
import { Drawer, Heading, IconButton, Tooltip } from "@medusajs/ui"
import { ComponentType, useState } from "react"
import { useTranslation } from "react-i18next"

import { WidgetExtension } from "../../../dashboard-app/types"
import { useExtension } from "../../../providers/extension-provider"

/**
 * Renders the widgets injected into a topbar injection zone (`topbar.before`
 * or `topbar.after`), located next to the notifications bell.
 *
 * Each widget can be rendered in one of two ways, depending on its config:
 * - `type: "inline"` (default): the widget component is rendered directly.
 * - `type: "icon"`: an icon button is rendered, which opens a side drawer
 *   containing the widget component when clicked (like the notifications bell).
 */
export const TopbarWidgets = ({ zone }: { zone: InjectionZone }) => {
  const { getTopbarWidgets } = useExtension()
  const widgets = getTopbarWidgets(zone)

  if (!widgets.length) {
    return null
  }

  return (
    <>
      {widgets.map((widget, index) => (
        <TopbarWidget key={index} widget={widget} />
      ))}
    </>
  )
}

const TopbarWidget = ({ widget }: { widget: WidgetExtension }) => {
  const { Component, type, icon, label } = widget

  if (type === "icon") {
    return <TopbarWidgetDrawer Component={Component} Icon={icon} label={label} />
  }

  return <Component />
}

const TopbarWidgetDrawer = ({
  Component,
  Icon,
  label,
}: {
  Component: ComponentType
  Icon?: ComponentType
  label?: string
}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const TriggerIcon = Icon ?? PuzzleSolid
  const title = label ?? t("app.menus.actions.openWidget", "Widget")

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Tooltip content={title}>
        <Drawer.Trigger asChild>
          <IconButton
            variant="transparent"
            size="small"
            className="text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            <TriggerIcon />
          </IconButton>
        </Drawer.Trigger>
      </Tooltip>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title asChild>
            <Heading>{title}</Heading>
          </Drawer.Title>
          <Drawer.Description className="sr-only">{title}</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body className="overflow-y-auto px-0">
          <Component />
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  )
}
