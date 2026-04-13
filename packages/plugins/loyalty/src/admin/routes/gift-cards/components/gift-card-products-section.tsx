import { Tag } from "@medusajs/icons";
import { Container } from "@medusajs/ui";
import { Link } from "react-router-dom";
import { Header } from "../../../components/header";
import { NoRecords } from "../../../components/no-records";
import { SidebarLink } from "../../../components/sidebar-link";
import { useProducts } from "../../../hooks/api/products";

const GiftCardProductsSection = () => {
  const { products: giftCardProducts, count = 0 } = useProducts({
    is_giftcard: true,
  });

  if (!giftCardProducts?.length) {
    return;
  }

  const slicedProducts = giftCardProducts.slice(0, 3);

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between">
        <Header title="Gift Card Products" />

        <Link
          to={`/gift-cards/gift-card-products/create`}
          className="text-ui-fg-muted text-sm px-6"
        >
          Create
        </Link>
      </div>

      {giftCardProducts?.length === 0 && (
        <NoRecords
          className="px-10 py-4 h-[200px]"
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
          className="text-ui-fg-muted text-sm px-6 py-4 flex items-center justify-center"
        >
          View more
        </Link>
      )}
    </Container>
  );
};

export default GiftCardProductsSection;
