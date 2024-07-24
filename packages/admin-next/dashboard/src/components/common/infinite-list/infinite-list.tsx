import { QueryKey, useInfiniteQuery } from "@tanstack/react-query"
import { ReactNode, useEffect, useMemo, useRef } from "react"
import { Skeleton } from "../skeleton"
import { toast } from "@medusajs/ui"
import { Spinner } from "@medusajs/icons"
import { useTranslation } from "react-i18next"

type InfiniteListProps<TResponse, TEntity, TParams> = {
  queryKey: QueryKey
  queryFn: (params: TParams) => Promise<TResponse>
  queryOptions?: { enabled?: boolean }
  renderItem: (item: TEntity) => ReactNode
  responseKey: keyof TResponse
  pageSize?: number
}

export const InfiniteList = <
  TResponse extends { count: number; offset: number; limit: number },
  TEntity extends { id: string },
  TParams extends { offset?: number; limit?: number },
>({
  queryKey,
  queryFn,
  queryOptions,
  renderItem,
  responseKey,
  pageSize = 20,
}: InfiniteListProps<TResponse, TEntity, TParams>) => {
  const { t } = useTranslation()

  const {
    data,
    error,
    fetchNextPage,
    fetchPreviousPage,
    hasPreviousPage,
    hasNextPage,
    isFetching,
    isPending,
  } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      return await queryFn({
        limit: pageSize,
        offset: pageParam,
      } as TParams)
    },
    initialPageParam: 0,
    maxPages: 5,
    getNextPageParam: (lastPage) => {
      const moreItemsExist = lastPage.count > lastPage.offset + lastPage.limit
      return moreItemsExist ? lastPage.offset + lastPage.limit : undefined
    },
    getPreviousPageParam: (firstPage) => {
      const moreItemsExist = firstPage.offset !== 0
      return moreItemsExist
        ? Math.max(firstPage.offset - firstPage.limit, 0)
        : undefined
    },
    ...queryOptions,
  })

  const items = useMemo(() => {
    return data?.pages.flatMap((p) => p[responseKey] as TEntity[]) ?? []
  }, [data, responseKey])

  const parentRef = useRef<HTMLDivElement>(null)
  const startObserver = useRef<IntersectionObserver>()
  const endObserver = useRef<IntersectionObserver>()

  useEffect(() => {
    if (isPending) {
      return
    }

    // Define the new observers after we stop fetching
    if (!isFetching) {
      // Define the new observers after paginating
      startObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasPreviousPage) {
          fetchPreviousPage()
        }
      })

      endObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })

      // Register the new observers to observe the new first and last children
      startObserver.current?.observe(parentRef.current!.firstChild as Element)
      endObserver.current?.observe(parentRef.current!.lastChild as Element)
    }

    // Clear the old observers
    return () => {
      startObserver.current?.disconnect()
      endObserver.current?.disconnect()
    }
  }, [
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    isPending,
  ])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  if (isPending) {
    return <Skeleton className="h-[148px] w-full rounded-lg" />
  }

  return (
    <div ref={parentRef}>
      {items &&
        items.map((item) => <div key={item.id}>{renderItem(item)}</div>)}

      {(isFetching || !hasNextPage) && (
        <div className="my-4 flex flex-col items-center justify-center">
          {isFetching && <Spinner className="animate-spin" />}
          {!hasNextPage && <p className="m-2">{t("general.noMoreData")}</p>}
        </div>
      )}
    </div>
  )
}
