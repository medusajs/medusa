/**
 * Public component exports for `@medusajs/dashboard/components`.
 */

import {
  Layouts,
  LAYOUT_TRIGGER_LOCATIONS,
  LayoutComposer as LayoutComposerImpl,
  LayoutComposerProps as LayoutComposerPropsImpl,
  LayoutEntry,
} from "../components/layout-composer"

type LayoutComposerProps<TLayoutId extends Layouts, TData> = Omit<
  LayoutComposerPropsImpl<TLayoutId, TData>,
  "triggerLocation" | "controlsLocation" | "controlSize"
>
const LayoutComposerRoot = <TLayoutId extends Layouts, TData>({
  widgetsZonePrefix,
  preferredLayoutId,
  sections,
  data,
  hasOutlet = true,
  disableWidgets = false,
}: LayoutComposerProps<TLayoutId, TData>) => {
  return (
    <LayoutComposerImpl
      widgetsZonePrefix={widgetsZonePrefix}
      preferredLayoutId={preferredLayoutId}
      sections={sections}
      data={data}
      hasOutlet={hasOutlet}
      triggerLocation={LAYOUT_TRIGGER_LOCATIONS.TOPBAR}
      controlsLocation={LAYOUT_TRIGGER_LOCATIONS.TOPBAR_CONTROLS}
      controlSize="default"
      disableWidgets={disableWidgets}
    />
  )
}

export const LayoutComposer = Object.assign(LayoutComposerRoot, {
  Entry: LayoutEntry,
})

export type { LayoutComponentProps } from "../components/layout-composer/types"
