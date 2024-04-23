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
      {pagination && (
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
      )}
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
