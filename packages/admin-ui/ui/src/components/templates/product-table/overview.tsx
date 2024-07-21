import { Product } from "@medusajs/medusa"
import clsx from "clsx"
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
      <div className="border-grey-20 pe-xlarge flex justify-end border-b border-t py-2.5">
        <div className="inter-small-semibold text-grey-50 flex justify-self-end">
          <span
            onClick={toggleListView}
            className={clsx(
              "hover:bg-grey-5 text-grey-40 cursor-pointer rounded p-0.5"
            )}
          >
            <ListIcon size={20} />
          </span>
          <span
            className={clsx(
              "hover:bg-grey-5 text-grey-90 cursor-pointer rounded p-0.5"
            )}
          >
            <TileIcon size={20} />
          </span>
        </div>
      </div>
      <div className="grid grid-cols-6">
        {products?.map((product) => <ProductTile product={product} />)}
      </div>
    </>
  )
}

const ProductTile = ({ product }) => {
  const { getActions } = useProductActions(product)

  return (
    <div className="p-base rounded-rounded hover:bg-grey-5 group flex-col">
      <div className="relative">
        <div className={clsx("rounded-base absolute end-2 top-2 inline-block")}>
          <Actionables
            actions={getActions()}
            customTrigger={
              <Button
                variant="ghost"
                size="small"
                className="w-xlarge h-xlarge hidden-actions bg-grey-0 opacity-0 focus-within:opacity-100 group-hover:opacity-100"
              >
                <MoreHorizontalIcon size={20} />
              </Button>
            }
          />
        </div>
        <Link to={`${product.id}`}>
          {product.thumbnail ? (
            <img
              className="rounded-rounded block min-h-[230px] object-cover"
              src={product.thumbnail}
            />
          ) : (
            <div className="bg-grey-5 rounded-rounded flex min-h-[230px] items-center justify-center">
              <ImagePlaceholder />
            </div>
          )}
          <div>
            <div className="mt-base flex items-center justify-between">
              <p className="inter-small-regular text-grey-90 me-3 line-clamp-1">
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
