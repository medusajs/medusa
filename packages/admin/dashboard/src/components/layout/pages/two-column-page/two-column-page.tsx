import { clx } from "@medusajs/ui"
import { Children, ComponentPropsWithoutRef, ComponentType } from "react"
import { Outlet } from "react-router-dom"
import { JsonViewSection } from "../../../common/json-view-section"
import { MetadataSection } from "../../../common/metadata-section"
import { PageProps, WidgetProps } from "../types"
import { RequiredPermissionsSection } from "../../../common/required-permissions-section"

interface TwoColumnWidgetProps extends WidgetProps {
  sideBefore: ComponentType<any>[]
  sideAfter: ComponentType<any>[]
}

interface TwoColumnPageProps<TData> extends PageProps<TData> {
  widgets: TwoColumnWidgetProps
  /**
   * Optional section rendered under the JSON section.
   */
  requiredPermissionsSection?: ComponentPropsWithoutRef<"div">["children"]
}

const Root = <TData,>({
  children,
  /**
   * Widgets to be rendered in the main content area and sidebar.
   */
  widgets,
  /**
   * Data to be passed to widgets, JSON view, and Metadata view.
   */
  data,
  /**
   * Whether to show JSON view of the data. Defaults to false.
   */
  showJSON = false,
  /**
   * Whether to show metadata view of the data. Defaults to false.
   */
  showMetadata = false,
  /**
   * Optional section rendered under the JSON section.
   */
  requiredPermissionsSection = <RequiredPermissionsSection />,
  /**
   * Whether to render an outlet for children routes. Defaults to true.
   */
  hasOutlet = true,
}: TwoColumnPageProps<TData>) => {
  const widgetProps = { data }
  const { before, after, sideBefore, sideAfter } = widgets

  if (showJSON && !data) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "`showJSON` is true but no data is provided. To display JSON, provide data prop."
      )
    }

    showJSON = false
  }

  if (showMetadata && !data) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "`showMetadata` is true but no data is provided. To display metadata, provide data prop."
      )
    }

    showMetadata = false
  }

  const childrenArray = Children.toArray(children)

  if (childrenArray.length !== 2) {
    throw new Error("TwoColumnPage expects exactly two children")
  }

  const [main, sidebar] = childrenArray
  const showExtraData = showJSON || showMetadata

  return (
    <div className="flex w-full flex-col gap-y-3">
      {before.map((Component, i) => {
        return <Component {...widgetProps} key={i} />
      })}
      <div className="flex w-full flex-col items-start gap-x-4 gap-y-3 xl:grid xl:grid-cols-[minmax(0,_1fr)_440px]">
        <div className="flex w-full min-w-0 flex-col gap-y-3">
          {main}
          {after.map((Component, i) => {
            return <Component {...widgetProps} key={i} />
          })}
          {showExtraData && (
            <div className="hidden flex-col gap-y-3 xl:flex">
              {showMetadata && <MetadataSection data={data!} />}
              {showJSON && <JsonViewSection data={data!} />}
              {showJSON && requiredPermissionsSection}
            </div>
          )}
        </div>
        <div className="flex w-full flex-col gap-y-3 xl:mt-0">
          {sideBefore.map((Component, i) => {
            return <Component {...widgetProps} key={i} />
          })}
          {sidebar}
          {sideAfter.map((Component, i) => {
            return <Component {...widgetProps} key={i} />
          })}
          {showExtraData && (
            <div className="flex flex-col gap-y-3 xl:hidden">
              {showMetadata && <MetadataSection data={data!} />}
              {showJSON && <JsonViewSection data={data!} />}
              {showJSON && requiredPermissionsSection}
            </div>
          )}
        </div>
      </div>
      {hasOutlet && <Outlet />}
    </div>
  )
}

const Main = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) => {
  return (
    <div className={clx("flex w-full flex-col gap-y-3", className)} {...props}>
      {children}
    </div>
  )
}

const Sidebar = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className={clx(
        "flex w-full max-w-[100%] flex-col gap-y-3 xl:mt-0 xl:max-w-[440px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const TwoColumnPage = Object.assign(Root, { Main, Sidebar })
