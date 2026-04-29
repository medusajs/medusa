import { ShoppingCart } from "@medusajs/icons";
import { Container } from "@medusajs/ui";
import { AdminGiftCard } from "../../../../../types";
import { Header } from "../../../../components/header";
import { SidebarLink } from "../../../../components/sidebar-link";
import { useGiftCardOrders } from "../../../../hooks/api/gift-cards";

const GiftCardOrderSection = ({ giftCard }: { giftCard: AdminGiftCard }) => {
  const { orders, isLoading, isError, error } = useGiftCardOrders(
    giftCard?.id!
  );

  if (isError) {
    throw error;
  }

  if (isLoading || !orders) {
    return null;
  }

  if (orders && orders.length === 0) {
    return null;
  }

  return (
    <Container className="p-0">
      <Header title="Order" />

      {orders.map((order) => (
        <SidebarLink
          to={`/orders/${order.id}`}
          labelKey={`#${order.display_id}`}
          icon={<ShoppingCart />}
          descriptionKey={`Order #${order.display_id}`}
        />
      ))}
    </Container>
  );
};

export default GiftCardOrderSection;
