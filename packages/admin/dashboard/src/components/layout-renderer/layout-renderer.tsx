import { ReactNode } from "react"
import { Outlet } from "react-router-dom"
import { useExtension } from "../../providers/extension-provider/use-extension"
import { CORE_CONTENT_ORDER } from "./constants"
import type { LayoutSectionRegistry } from "./types"

type Layouts = keyof LayoutSectionRegistry
type SectionNameFor<TLayoutId extends Layouts> = LayoutSectionRegistry[TLayoutId]

type LayoutRendererProps<
  TLayoutId extends Layouts,
  TData
> = {
  route: string
  preferredLayoutId: TLayoutId
  sections: Record<SectionNameFor<TLayoutId>, ReactNode>
  data?: TData
  hasOutlet?: boolean
}

export const LayoutRenderer = <
  TLayoutId extends Layouts,
  TData
>({
  route,
  preferredLayoutId,
  sections,
  data,
  hasOutlet = true,
}: LayoutRendererProps<TLayoutId, TData>) => {
  const { getWidgetsForSections, getLayout } = useExtension()

  // TODO: Implement switching between compatible layouts
  const layoutId = preferredLayoutId

  const layout = getLayout(layoutId)
  const widgetsBySection = getWidgetsForSections(route, layout?.sections?.map((s) => s.id) ?? [])
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
