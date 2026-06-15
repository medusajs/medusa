import { ReactNode } from "react"
import { Outlet } from "react-router-dom"
import { useExtension } from "../../providers/extension-provider/use-extension"
import { CORE_CONTENT_ORDER } from "./constants"
import type { LayoutSectionRegistry } from "./types"

type Layouts = keyof LayoutSectionRegistry
type SectionNameFor<TLayoutId extends Layouts> =
  LayoutSectionRegistry[TLayoutId]

type LayoutComposerProps<TLayoutId extends Layouts, TData> = {
  /**
   * The prefix used to derive widget injection zones, typically corresponds to the page.
   * E.g. `"login"`, `"product.list"`, `"product.details"` etc.
   */
  widgetsZonePrefix: string
  /**
   * The id of the layout that should be used to render the page. E.g `"core:two-column"` or `"core:single-column"`.
   */
  preferredLayoutId: TLayoutId
  /**
   * The content to render in each section of the layout, keyed by the
   * section names valid for `preferredLayoutId`.
   */
  sections: Record<SectionNameFor<TLayoutId>, ReactNode>
  /**
   * Data passed to the layout components(core + widgets) as props
   */
  data?: TData
  /**
   * Whether to render an `Outlet` after the layout, used to render modals such as drawers and dialogs.
   *
   * @default true
   */
  hasOutlet?: boolean
}

export const LayoutComposer = <TLayoutId extends Layouts, TData>({
  widgetsZonePrefix,
  preferredLayoutId,
  sections,
  data,
  hasOutlet = true,
}: LayoutComposerProps<TLayoutId, TData>) => {
  const { getWidgetsForSections, getLayout } = useExtension()

  // TODO: Implement switching between compatible layouts
  const layoutId = preferredLayoutId

  const layout = getLayout(layoutId)
  const widgetsBySection = getWidgetsForSections(
    widgetsZonePrefix,
    layout?.sections?.map((s) => s.id) ?? []
  )
  const widgetProps = { data }

  const renderedSections: Record<string, ReactNode> = {}
  for (const { id } of layout?.sections ?? []) {
    const widgets = widgetsBySection[id] ?? []
    const before = widgets.filter((w) => w.order < CORE_CONTENT_ORDER)
    const after = widgets.filter((w) => w.order >= CORE_CONTENT_ORDER)
    renderedSections[id] = (
      <>
        {before.map(({ Component }, i) => (
          <Component key={i} {...widgetProps} />
        ))}
        {sections[id as SectionNameFor<TLayoutId>]}
        {after.map(({ Component }, i) => (
          <Component key={i} {...widgetProps} />
        ))}
      </>
    )
  }

  const LayoutComponent = layout?.Component
  if (!LayoutComponent) return null

  return (
    <>
      <LayoutComponent sections={renderedSections} data={data} />
      {hasOutlet && <Outlet />}
    </>
  )
}
