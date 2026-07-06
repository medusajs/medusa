import { Container } from "@medusajs/ui";
import { Fragment } from "react";
import { Outlet } from "react-router-dom";

import { AdminGiftCard } from "../../../../../types";
import { DataTable } from "../../../../components/data-table";
import { useGiftCards } from "../../../../hooks/api/gift-cards";
import { useGiftCardTableColumns } from "./columns";
import { useGiftCardFilters } from "./filters";
import { useGiftCardTableQuery } from "./query";

const PAGE_SIZE = 10;

export function GiftCardsTable() {
  const queryParams = useGiftCardTableQuery({
    pageSize: PAGE_SIZE,
  });

  const {
    gift_cards: giftCards,
    isPending,
    count,
  } = useGiftCards({
    ...queryParams,
    order: queryParams.order ?? "-created_at",
    fields: "+line_item.product.title",
  });

  const columns = useGiftCardTableColumns();
  const filters = useGiftCardFilters();

  return (
    <Fragment>
      <Container className="p-0">
        <DataTable
          data={giftCards}
          getRowId={(row: AdminGiftCard) => row.id}
          columns={columns}
          filters={filters}
          isLoading={isPending}
          pageSize={PAGE_SIZE}
          rowCount={count}
          heading="Gift Cards"
          rowHref={(row: AdminGiftCard) => `${row.id}`}
          emptyState={{
            empty: {
              heading: "No gift cards found",
              description: "Create a gift card to get started.",
            },
            filtered: {
              heading: "No results found",
              description: "No gift cards match your filter criteria.",
            },
          }}
          actions={[
            {
              label: "Create",
              to: "create",
            },
          ]}
        />
      </Container>

      <Outlet />
    </Fragment>
  );
}
