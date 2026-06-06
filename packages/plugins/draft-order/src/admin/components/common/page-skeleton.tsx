import { clx, Skeleton } from "@zjedene-medusa/ui"

interface PageSkeletonProps {
  mainSections?: number
  sidebarSections?: number
  showJSON?: boolean
  showMetadata?: boolean
}

export const PageSkeleton = ({
  mainSections = 2,
  sidebarSections = 1,
  showJSON = false,
  showMetadata = true,
}: PageSkeletonProps) => {
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
