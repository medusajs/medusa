/**
 * Public component exports for `@medusajs/dashboard/components`.
 */

import {
  Layouts,
  CUSTOMIZE_IDS,
  LayoutComposer as LayoutComposerImpl,
  LayoutComposerProps as LayoutComposerPropsImpl,
  LayoutEntry,
} from "../components/layout-composer"

type LayoutComposerProps<TLayoutId extends Layouts, TData> = Omit<
  LayoutComposerPropsImpl<TLayoutId, TData>,
  "customizeId" | "controlSize"
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
      customizeId={CUSTOMIZE_IDS.PAGE}
      controlSize="default"
      disableWidgets={disableWidgets}
    />
  )
}

export const LayoutComposer = Object.assign(LayoutComposerRoot, {
  Entry: LayoutEntry,
})

export type { LayoutComponentProps } from "../components/layout-composer/types"
