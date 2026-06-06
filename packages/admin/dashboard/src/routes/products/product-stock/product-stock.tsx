import { HttpTypes } from "@zjedene-medusa/types"
import { AnimatePresence } from "motion/react"
import { Suspense, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Await, useLoaderData } from "react-router-dom"

import { ColumnDef } from "@tanstack/react-table"
import { ProgressBar } from "../../../components/common/progress-bar"
import { Skeleton } from "../../../components/common/skeleton"
import { DataGridSkeleton } from "../../../components/data-grid/components"
import { RouteFocusModal } from "../../../components/modals"
import { ProductStockForm } from "./components/product-stock-form"
import { productStockLoader } from "./loader"

export const ProductStock = () => {
  const { t } = useTranslation()
  const data = useLoaderData() as Awaited<ReturnType<typeof productStockLoader>>

  /**
   * We render a local ProgressBar, as we cannot rely on the global NavigationBar.
   * This is because we are deferring the data, meaning that the navigation is
   * instant, and the data is loaded in parallel with the navigation, but may resolve
   * after the navigation has completed. This will result in the data loading after the
   * navigation has completed most of the time for this route, as we chunk the data into
   * multiple queries.
   *
   * Here we instead render a local ProgressBar, which is animated, and exit
   * the animation when the data is loaded, and the form is rendered.
   */
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIsLoading(true)
    }, 200)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const onLoaded = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsLoading(false)
  }

  return (
    <div>
      <div className="fixed inset-x-0 top-0 z-50 h-1">
        <AnimatePresence>
          {isLoading ? <ProgressBar duration={5} /> : null}
        </AnimatePresence>
      </div>
      <RouteFocusModal>
        <RouteFocusModal.Title asChild>
          <span className="sr-only">{t("products.stock.heading")}</span>
        </RouteFocusModal.Title>
        <RouteFocusModal.Description asChild>
          <span className="sr-only">{t("products.stock.description")}</span>
        </RouteFocusModal.Description>
        <Suspense fallback={<ProductStockFallback />}>
          <Await resolve={data.data}>
            {(data: {
              variants: HttpTypes.AdminProductVariant[]
              locations: HttpTypes.AdminStockLocation[]
            }) => {
              return (
                <ProductStockForm
                  variants={data.variants}
                  locations={data.locations}
                  onLoaded={onLoaded}
                />
              )
            }}
          </Await>
        </Suspense>
      </RouteFocusModal>
    </div>
  )
}

const ProductStockFallback = () => {
  return (
    <div className="relative flex size-full flex-col items-center justify-center divide-y">
      <div className="flex size-full flex-col divide-y">
        <div className="px-4 py-2">
          <Skeleton className="h-7 w-7" />
        </div>
        <div className="flex-1 overflow-auto">
          <DataGridSkeleton
            columns={Array.from({ length: 10 }) as ColumnDef<any>[]}
          />
        </div>
        <div className="bg-ui-bg-base flex items-center justify-end gap-x-2 p-4">
          <Skeleton className="h-7 w-[59px]" />
          <Skeleton className="h-7 w-[46px]" />
        </div>
      </div>
    </div>
  )
}
