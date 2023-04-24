import React, { FC } from "react"
import { Order } from "@medusajs/medusa"
import BodyCard from "../../../../components/organisms/body-card"
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import { Product } from "@medusajs/medusa/dist/models/product"

interface CustomerResponsesProps {
  items: Order["items"]
}

export const CustomerResponses: FC<CustomerResponsesProps> = ({ items }) => {
  const itemsWithResponses = items.filter(
    (item) => !!item.customer_product_response
  )

  if (itemsWithResponses.length <= 0) return null

  return (
    <BodyCard
      className={"w-full mb-4 min-h-0 h-auto"}
      title="Customer Responses"
    >
      {itemsWithResponses.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 border-b last:border-b-0 border-gray-200"
        >
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-[48px] w-[36px] rounded-rounded overflow-hidden">
                {item.thumbnail ? (
                  <img src={item.thumbnail} className="object-cover" />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              <div className="flex flex-col justify-center max-w-[185px]">
                <span className="text-grey-90 truncate">{item.title}</span>
                {item?.variant && (
                  <span className="inter-small-regular text-grey-50 truncate">
                    {`${item.variant.title}${
                      item.variant.sku ? ` (${item.variant.sku})` : ""
                    }`}
                  </span>
                )}
                <div className="font-normal inter-small-regular text-gray-500">
                  Qty {item.quantity}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="inter-small-regular font-bold text-grey-90">
                {item.variant.product.customer_response_prompt}
              </span>
              <span className="inter-small-regular text-grey-90">
                {item.customer_product_response}
              </span>
            </div>
          </div>
        </div>
      ))}
    </BodyCard>
  )
}
