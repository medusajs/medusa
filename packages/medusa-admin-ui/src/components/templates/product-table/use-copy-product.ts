import { AdminPostProductsReq, Product } from "@medusajs/medusa"
import { omit } from "lodash"
import { useAdminCreateProduct } from "medusa-react"
import { useNavigate } from "react-router-dom"
import useNotification from "../../../hooks/use-notification"
import { ProductStatus } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"

/**
 * Utility function to create a new title and handle for a copied product.
 * This allows the user to duplicate a product multiple times in a row,
 * without having to manually change the title and handle of the previous copies.
 */
const createCopyTitleAndHandle = (title: string, handle: string) => {
  const timestamp = new Date().toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })

  // If the product has already been copied, we want to remove the previous copy title
  const newTitle = `${title.replace(
    / \(\d{1,}:\d{1,}:\d{1,}\)$/,
    ""
  )} (${timestamp})`

  // If the handle already contains a timestamp, we replace it with the new one
  const newHandle = `${handle.replace(
    /-copy(-\d{1,}){3}(-am|pm])*/g,
    ""
  )}-copy-${timestamp.replace(/:/g, "-").toLowerCase()}`

  return { newTitle, newHandle }
}

const useCopyProduct = () => {
  const navigate = useNavigate()
  const notification = useNotification()
  const { mutate } = useAdminCreateProduct()

  const handleCopyProduct = (product: Product) => {
    const {
      variants,
      options,
      type,
      tags,
      images,
      collection_id,
      collection,
      sales_channels,
      title,
      handle,
      ...rest
    } = omit(product, [
      "id",
      "created_at",
      "updated_at",
      "deleted_at",
      "external_id",
      "profile_id",
      "profile",
      "type_id",
      "status",
    ])

    const base: Partial<AdminPostProductsReq> = Object.entries(rest).reduce(
      (acc, [key, value]) => {
        if (value) {
          acc[key] = value
        }

        return acc
      },
      {} as Partial<AdminPostProductsReq>
    )

    if (variants && variants.length) {
      const copiedVariants: AdminPostProductsReq["variants"] = []

      variants.forEach((variant) => {
        const { prices, options, ...rest } = omit(variant, [
          "id",
          "created_at",
          "updated_at",
          "deleted_at",
          "product",
          "product_id",
          "variant_rank",
        ])

        const variantBase = Object.entries(rest).reduce((acc, [key, value]) => {
          if (value) {
            acc[key] = value
          }

          return acc
        }, {} as NonNullable<AdminPostProductsReq["variants"]>[0])

        if (prices && prices.length) {
          variantBase.prices = prices.map((price) => ({
            amount: price.amount,
            currency_code: !price.region_id ? price.currency_code : undefined,
            region_id: price.region_id,
          }))
        }

        if (options && options.length) {
          variantBase.options = options.map((option) => ({
            value: option.value,
          }))
        }

        copiedVariants.push(variantBase)
      })

      base.variants = copiedVariants
    }

    if (options && options.length) {
      base.options = options.map((option) => ({
        title: option.title,
      }))
    }

    if (images && images.length) {
      base.images = images.map((image) => image.url)
    }

    if (collection) {
      base.collection_id = collection.id
    } else if (collection_id) {
      base.collection_id = collection_id
    }

    if (sales_channels && sales_channels.length) {
      base.sales_channels = sales_channels.map((channel) => ({
        id: channel.id,
      }))
    }

    if (tags && tags.length) {
      base.tags = tags.map(({ id, value }) => ({ id, value }))
    }

    if (type) {
      base.type = {
        id: product.type.id,
        value: product.type.value,
      }
    }

    base.status = ProductStatus.DRAFT

    const { newTitle, newHandle } = createCopyTitleAndHandle(
      title,
      handle || ""
    )

    base.title = newTitle
    base.handle = newHandle

    mutate(base as AdminPostProductsReq, {
      onSuccess: ({ product: copiedProduct }) => {
        navigate(`/a/products/${copiedProduct.id}`)
        notification("Success", "Created a new product", "success")
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  return handleCopyProduct
}

export default useCopyProduct
