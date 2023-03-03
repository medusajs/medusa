import { Product } from "@medusajs/medusa"
import clsx from "clsx"
import * as React from "react"
import { Link } from "react-router-dom"
import { getProductStatusVariant } from "../../../utils/product-status-variant"
import Button from "../../fundamentals/button"
import ListIcon from "../../fundamentals/icons/list-icon"
import MoreHorizontalIcon from "../../fundamentals/icons/more-horizontal-icon"
import TileIcon from "../../fundamentals/icons/tile-icon"
import ImagePlaceholder from "../../fundamentals/image-placeholder"
import StatusIndicator from "../../fundamentals/status-indicator"
import Actionables from "../../molecules/actionables"
import useProductActions from "./use-product-actions"

type ProductOverviewProps = {
  products?: Product[]
  toggleListView: () => void
}

const ProductOverview = ({
  products,
  toggleListView,
}: ProductOverviewProps) => {
  return (
    <>
      <div className="flex justify-end border-t border-b border-grey-20 py-2.5 pr-xlarge">
        <div className="inter-small-semibold text-grey-50 flex justify-self-end">
          <span
            onClick={toggleListView}
            className={clsx(
              "hover:bg-grey-5 cursor-pointer rounded p-0.5 text-grey-40"
            )}
          >
            <ListIcon size={20} />
          </span>
          <span
            className={clsx(
              "hover:bg-grey-5 cursor-pointer rounded p-0.5 text-grey-90"
            )}
          >
            <TileIcon size={20} />
          </span>
        </div>
      </div>
      <div className="grid grid-cols-6">
        {products?.map((product) => (
          <ProductTile product={product} />
        ))}
      </div>
    </>
  )
}

const ProductTile = ({ product }) => {
  const { getActions } = useProductActions(product)

  return (
    <div className="p-base group rounded-rounded hover:bg-grey-5 flex-col">
      <div className="relative">
        <div
          className={clsx("rounded-base inline-block absolute top-2 right-2")}
        >
          <Actionables
            actions={getActions()}
            customTrigger={
              <Button
                variant="ghost"
                size="small"
                className="w-xlarge h-xlarge hidden-actions group-hover:opacity-100 focus-within:opacity-100 opacity-0 bg-grey-0"
              >
                <MoreHorizontalIcon size={20} />
              </Button>
            }
          />
        </div>
        <Link to={`${product.id}`}>
          {product.thumbnail ? (
            <img
              className="min-h-[230px] block object-cover rounded-rounded"
              src={product.thumbnail}
            />
          ) : (
            <div className="min-h-[230px] flex items-center justify-center bg-grey-5 rounded-rounded">
              <ImagePlaceholder />
            </div>
          )}
          <div>
            <div className="mt-base flex items-center justify-between">
              <p className="inter-small-regular text-grey-90 line-clamp-1 mr-3">
                {product.title}
              </p>
              <StatusIndicator
                variant={getProductStatusVariant(product.status)}
                className="shrink-0"
              />
            </div>
            <span className="inter-small-regular text-grey-50 line-clamp-1">
              {product.collection?.title}
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default ProductOverview
