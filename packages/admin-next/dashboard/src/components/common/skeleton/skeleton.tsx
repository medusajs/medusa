import { Container, Heading, Text, clx } from "@medusajs/ui"
import { CSSProperties, ComponentPropsWithoutRef } from "react"

type SkeletonProps = {
  className?: string
  style?: CSSProperties
}

export const Skeleton = ({ className, style }: SkeletonProps) => {
  return (
    <div
      aria-hidden
      className={clx(
        "bg-ui-bg-component h-3 w-3 animate-pulse rounded-[4px]",
        className
      )}
      style={style}
    />
  )
}

type TextSkeletonProps = {
  size?: ComponentPropsWithoutRef<typeof Text>["size"]
  leading?: ComponentPropsWithoutRef<typeof Text>["leading"]
  characters?: number
}

type HeadingSkeletonProps = {
  level?: ComponentPropsWithoutRef<typeof Heading>["level"]
  characters?: number
}

export const HeadingSkeleton = ({
  level = "h1",
  characters = 10,
}: HeadingSkeletonProps) => {
  let charWidth = 9

  switch (level) {
    case "h1":
      charWidth = 11
      break
    case "h2":
      charWidth = 10
      break
    case "h3":
      charWidth = 9
      break
  }

  return (
    <Skeleton
      className={clx({
        "h-7": level === "h1",
        "h-6": level === "h2",
        "h-5": level === "h3",
      })}
      style={{
        width: `${charWidth * characters}px`,
      }}
    />
  )
}

export const TextSkeleton = ({
  size = "small",
  leading = "compact",
  characters = 10,
}: TextSkeletonProps) => {
  let charWidth = 9

  switch (size) {
    case "xlarge":
      charWidth = 13
      break
    case "large":
      charWidth = 11
      break
    case "base":
      charWidth = 10
      break
    case "small":
      charWidth = 9
      break
    case "xsmall":
      charWidth = 8
      break
  }

  return (
    <Skeleton
      className={clx({
        "h-5": size === "xsmall",
        "h-6": size === "small",
        "h-7": size === "base",
        "h-8": size === "xlarge",
        "!h-5": leading === "compact",
      })}
      style={{
        width: `${charWidth * characters}px`,
      }}
    />
  )
}

export const IconButtonSkeleton = () => {
  return <Skeleton className="h-7 w-7 rounded-md" />
}

type GeneralSectionSkeletonProps = {
  rowCount?: number
}

export const GeneralSectionSkeleton = ({
  rowCount,
}: GeneralSectionSkeletonProps) => {
  const rows = Array.from({ length: rowCount ?? 0 }, (_, i) => i)

  return (
    <Container className="divide-y p-0" aria-hidden>
      <div className="flex items-center justify-between px-6 py-4">
        <HeadingSkeleton characters={16} />
        <IconButtonSkeleton />
      </div>
      {rows.map((row) => (
        <div
          key={row}
          className="grid grid-cols-2 items-center px-6 py-4"
          aria-hidden
        >
          <TextSkeleton size="small" leading="compact" characters={12} />
          <TextSkeleton size="small" leading="compact" characters={24} />
        </div>
      ))}
    </Container>
  )
}

export const TableFooterSkeleton = ({ layout }: { layout: "fill" | "fit" }) => {
  return (
    <div
      className={clx("flex items-center justify-between p-4", {
        "border-t": layout === "fill",
      })}
    >
      <Skeleton className="h-7 w-[138px]" />
      <div className="flex items-center gap-x-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-7 w-11" />
        <Skeleton className="h-7 w-11" />
      </div>
    </div>
  )
}

type TableSkeletonProps = {
  rowCount?: number
  search?: boolean
  filters?: boolean
  orderBy?: boolean
  pagination?: boolean
  layout?: "fit" | "fill"
}

export const TableSkeleton = ({
  rowCount = 10,
  search = true,
  filters = true,
  orderBy = true,
  pagination = true,
  layout = "fit",
}: TableSkeletonProps) => {
  // Row count + header row
  const totalRowCount = rowCount + 1

  const rows = Array.from({ length: totalRowCount }, (_, i) => i)
  const hasToolbar = search || filters || orderBy

  return (
    <div
      aria-hidden
      className={clx({
        "flex h-full flex-col overflow-hidden": layout === "fill",
      })}
    >
      {hasToolbar && (
        <div className="flex items-center justify-between px-6 py-4">
          {filters && <Skeleton className="h-7 w-full max-w-[135px]" />}
          {(search || orderBy) && (
            <div className="flex items-center gap-x-2">
              {search && <Skeleton className="h-7 w-[160px]" />}
              {orderBy && <Skeleton className="h-7 w-7" />}
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col divide-y border-y">
        {rows.map((row) => (
          <Skeleton key={row} className="h-10 w-full rounded-none" />
        ))}
      </div>
      {pagination && <TableFooterSkeleton layout={layout} />}
    </div>
  )
}

export const TableSectionSkeleton = (props: TableSkeletonProps) => {
  return (
    <Container className="divide-y p-0" aria-hidden>
      <div className="flex items-center justify-between px-6 py-4" aria-hidden>
        <HeadingSkeleton level="h2" characters={16} />
        <IconButtonSkeleton />
      </div>
      <TableSkeleton {...props} />
    </Container>
  )
}

export const JsonViewSectionSkeleton = () => {
  return (
    <Container className="divide-y p-0" aria-hidden>
      <div className="flex items-center justify-between px-6 py-4" aria-hidden>
        <div aria-hidden className="flex items-center gap-x-4">
          <HeadingSkeleton level="h2" characters={16} />
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>
        <IconButtonSkeleton />
      </div>
    </Container>
  )
}

type SingleColumnPageSkeletonProps = {
  sections?: number
  showJSON?: boolean
  showMetadata?: boolean
}

export const SingleColumnPageSkeleton = ({
  sections = 2,
  showJSON = false,
  showMetadata = false,
}: SingleColumnPageSkeletonProps) => {
  return (
    <div className="flex flex-col gap-y-3">
      {Array.from({ length: sections }, (_, i) => i).map((section) => {
        return (
          <Skeleton
            key={section}
            className={clx("h-full max-h-[460px] w-full rounded-lg", {
              // First section is smaller on most pages, this gives us less
              // layout shifting in general,
              "max-h-[219px]": section === 0,
            })}
          />
        )
      })}
      {showMetadata && <Skeleton className="h-[60px] w-full rounded-lg" />}
      {showJSON && <Skeleton className="h-[60px] w-full rounded-lg" />}
    </div>
  )
}

type TwoColumnPageSkeletonProps = {
  mainSections?: number
  sidebarSections?: number
  showJSON?: boolean
  showMetadata?: boolean
}

export const TwoColumnPageSkeleton = ({
  mainSections = 2,
  sidebarSections = 1,
  showJSON = false,
  showMetadata = true,
}: TwoColumnPageSkeletonProps) => {
  const showExtraData = showJSON || showMetadata

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-x-4 gap-y-3 xl:flex-row xl:items-start">
        <div className="flex w-full flex-col gap-y-3">
          {Array.from({ length: mainSections }, (_, i) => i).map((section) => {
            return (
              <Skeleton
                key={section}
                className={clx("h-full max-h-[460px] w-full rounded-lg", {
                  "max-h-[219px]": section === 0,
                })}
              />
            )
          })}
          {showExtraData && (
            <div className="hidden flex-col gap-y-3 xl:flex">
              {showMetadata && (
                <Skeleton className="h-[60px] w-full rounded-lg" />
              )}
              {showJSON && <Skeleton className="h-[60px] w-full rounded-lg" />}
            </div>
          )}
        </div>
        <div className="flex w-full max-w-[100%] flex-col gap-y-3 xl:mt-0 xl:max-w-[440px]">
          {Array.from({ length: sidebarSections }, (_, i) => i).map(
            (section) => {
              return (
                <Skeleton
                  key={section}
                  className={clx("h-full max-h-[320px] w-full rounded-lg", {
                    "max-h-[140px]": section === 0,
                  })}
                />
              )
            }
          )}
          {showExtraData && (
            <div className="flex flex-col gap-y-3 xl:hidden">
              {showMetadata && (
                <Skeleton className="h-[60px] w-full rounded-lg" />
              )}
              {showJSON && <Skeleton className="h-[60px] w-full rounded-lg" />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
