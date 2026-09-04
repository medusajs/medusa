import { Tag } from "@medusajs/icons"
import { Container } from "@medusajs/ui"
import { Link } from "react-router-dom"
import { Header } from "../../../components/header"
import { NoRecords, SidebarLink } from "@medusajs/dashboard/components"
import { useProducts } from "@medusajs/dashboard/hooks"

const GiftCardProductsSection = () => {
  const { products: giftCardProducts, count = 0 } = useProducts({
    is_giftcard: true,
  })

  const slicedProducts = giftCardProducts?.slice(0, 3) ?? []

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between">
        <Header title="Gift Card Products" />

        <Link
          to={`/gift-cards/gift-card-products/create`}
          className="text-ui-fg-muted px-6 text-sm"
        >
          Create
        </Link>
      </div>

      {giftCardProducts?.length === 0 && (
        <NoRecords
          className="h-[200px] px-10 py-4"
          title="No gift card products"
          message="There are no gift card products to show. Create one to get started."
          action={{
            to: "/gift-cards/gift-card-products/create",
            label: "Create gift card product",
          }}
        />
      )}

      {slicedProducts.map((giftCardProduct) => (
        <SidebarLink
          to={`/gift-cards/gift-card-products/${giftCardProduct.id}`}
          labelKey={giftCardProduct.title}
          descriptionKey={giftCardProduct.title}
          icon={<Tag />}
        ></SidebarLink>
      ))}

      {count > 3 && (
        <Link
          to="/gift-cards/gift-card-products"
          className="text-ui-fg-muted flex items-center justify-center px-6 py-4 text-sm"
        >
          View more
        </Link>
      )}
    </Container>
  )
}

export default GiftCardProductsSection
