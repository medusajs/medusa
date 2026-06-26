/**
 * Public component exports for `@medusajs/dashboard/components`.
 */

import {
  Layouts,
  LAYOUT_TRIGGER_LOCATIONS,
  LayoutComposer as LayoutComposerImpl,
  LayoutComposerProps as LayoutComposerPropsImpl,
} from "../components/layout-composer"

type LayoutComposerProps<TLayoutId extends Layouts, TData> = Omit<
  LayoutComposerPropsImpl<TLayoutId, TData>,
  "triggerLocation" | "controlsLocation" | "controlSize"
>
export const LayoutComposer = <TLayoutId extends Layouts, TData>({
  widgetsZonePrefix,
  preferredLayoutId,
  sections,
  data,
  hasOutlet = true,
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
    />
  )
}

export type { LayoutComponentProps } from "../components/layout-composer/types"
