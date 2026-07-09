import { Adjustments, AdjustmentsDone } from "@medusajs/icons"
import { DropdownMenu, IconButton, Tooltip } from "@medusajs/ui"
import { useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"
import { useHasLayoutCustomizations } from "../../hooks/api/layouts"
import {
  useLayoutCustomizerActiveEditor,
  useLayoutEditRequest,
} from "../../hooks/use-layout-customizer-trigger-host"
import { CUSTOMIZE_IDS } from "./constants"

type CustomizeHost = {
  /** Matches a `LayoutComposer`'s `customizeId`. */
  id: string
  /** The key to translate the label. */
  labelKey: string
  /** Route to open when the host isn't mounted on the current screen. */
  navigateTo?: string
  /** Whether this host's composer is mounted for the given path. */
  isMounted: (pathname: string) => boolean
}

const isSettingsPath = (pathname: string): boolean =>
  pathname === "/settings" || pathname.startsWith("/settings/")

/**
 * The customizable hosts, in menu order. Page and top bar are present on every
 * screen; the two sidebars are mounted by mutually exclusive route layouts
 * (settings routes vs. everything else), so customizing the off-screen one
 * navigates to it first — the request rides along in `location.state` and is
 * consumed once that layout mounts.
 */
const HOSTS: CustomizeHost[] = [
  {
    id: CUSTOMIZE_IDS.PAGE,
    labelKey: "layout.customizePage",
    isMounted: () => true,
  },
  {
    id: CUSTOMIZE_IDS.MAIN_SIDEBAR,
    labelKey: "layout.customizeSidebar",
    navigateTo: "/",
    isMounted: (pathname) => !isSettingsPath(pathname),
  },
  {
    id: CUSTOMIZE_IDS.SETTINGS_SIDEBAR,
    labelKey: "layout.customizeSettingsSidebar",
    navigateTo: "/settings",
    isMounted: isSettingsPath,
  },
  {
    id: CUSTOMIZE_IDS.TOPBAR,
    labelKey: "layout.customizeTopbar",
    isMounted: () => true,
  },
]

/**
 * The single entry point for layout customization, mounted in the shell's top
 * bar. Lists every customizable host; choosing one drives its `LayoutComposer`
 * into edit mode (navigating first if that host lives on another screen). While
 * a composer is editing, this menu hides and its Cancel/Save controls take the
 * adjacent slot.
 */
export const CustomizerMenu = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { activeEditor } = useLayoutCustomizerActiveEditor()
  const { requestEdit } = useLayoutEditRequest()
  const { has_customizations } = useHasLayoutCustomizations()

  // Consume a request carried across navigation: once the requested host's
  // layout has mounted here, fire its edit mode and strip the marker so a
  // refresh or back-navigation doesn't re-trigger it.
  useEffect(() => {
    const state = (location.state ?? null) as { customize?: string } | null
    const pending = state?.customize
    if (!pending) {
      return
    }
    requestEdit(pending)
    const { customize: _customize, ...rest } = state as Record<string, unknown>
    navigate(location.pathname, {
      replace: true,
      state: Object.keys(rest).length ? rest : undefined,
    })
  }, [location, navigate, requestEdit])

  const onSelect = useCallback(
    (host: CustomizeHost) => {
      if (host.isMounted(location.pathname)) {
        requestEdit(host.id)
        return
      }
      navigate(host.navigateTo ?? location.pathname, {
        state: { ...(location.state as object | null), customize: host.id },
      })
    },
    [location, navigate, requestEdit]
  )

  // A composer is editing; its controls occupy the slot in place of this menu.
  if (activeEditor) {
    return null
  }

  return (
    <DropdownMenu>
      <Tooltip content={t("layout.customizeLayout")}>
        <DropdownMenu.Trigger asChild>
          <IconButton
            size="small"
            variant="transparent"
            aria-label={t("layout.customizeLayout")}
            className="text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {has_customizations ? <AdjustmentsDone /> : <Adjustments />}
          </IconButton>
        </DropdownMenu.Trigger>
      </Tooltip>
      <DropdownMenu.Content>
        {HOSTS.map((host) => (
          <DropdownMenu.Item key={host.id} onClick={() => onSelect(host)}>
            {t(host.labelKey as any)}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
