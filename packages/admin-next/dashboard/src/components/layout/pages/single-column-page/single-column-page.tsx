import { Outlet } from "react-router-dom"
import { JsonViewSection } from "../../../common/json-view-section"
import { PageProps } from "../types"

export const SingleColumnPage = <TData,>({
  children,
  widgets,
  data,
  hasOutlet,
  showJSON,
}: PageProps<TData>) => {
  const { before, after } = widgets
  const widgetProps = { data }

  if (showJSON && !data) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "`showJSON` is true but no data is provided. To display JSON, provide data prop."
      )
    }

    showJSON = false
  }

  return (
    <div className="flex flex-col gap-y-3">
      {before.widgets.map((w, i) => {
        return <w.Component {...widgetProps} key={i} />
      })}
      {children}
      {after.widgets.map((w, i) => {
        return <w.Component {...widgetProps} key={i} />
      })}
      {showJSON && <JsonViewSection data={data!} />}
      {hasOutlet && <Outlet />}
    </div>
  )
}
