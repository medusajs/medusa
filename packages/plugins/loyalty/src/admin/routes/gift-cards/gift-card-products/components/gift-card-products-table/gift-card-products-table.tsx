import { Container } from "@medusajs/ui";
import { Fragment } from "react";
import { Outlet } from "react-router-dom";

import { AdminProduct } from "@medusajs/framework/types";
import { DataTable } from "../../../../../components/data-table";
import { useProducts } from "../../../../../hooks/api/products";
import { useGiftCardProductsTableColumns } from "./columns";
import { useGiftCardProductsFilters } from "./filters";
import { useGiftCardProductsTableQuery } from "./query";

const PAGE_SIZE = 10;

export function GiftCardProductsTable() {
  const queryParams = useGiftCardProductsTableQuery({
    pageSize: PAGE_SIZE,
  });

  const {
    products: giftCardProducts,
    isPending,
    count,
  } = useProducts({
    ...queryParams,
    is_giftcard: true,
    order: queryParams.order ?? "-created_at",
  });

  const columns = useGiftCardProductsTableColumns();
  const filters = useGiftCardProductsFilters();

  return (
    <Fragment>
      <Container className="p-0">
        <DataTable
          data={giftCardProducts}
          getRowId={(row: AdminProduct) => row.id}
          columns={columns}
          filters={filters}
          isLoading={isPending}
          pageSize={PAGE_SIZE}
          rowCount={count}
          enableSearch={false}
          heading="Gift Card Products"
          actions={[
            {
              label: "Create",
              to: "create",
            },
          ]}
          rowHref={(row: AdminProduct) => `${row.id}`}
          emptyState={{
            empty: {
              heading: "No gift card products found",
              description: "Create a new gift card product to get started.",
            },
            filtered: {
              heading: "No results found",
              description: "No gift card products match your filter criteria.",
            },
          }}
        />
      </Container>

      <Outlet />
    </Fragment>
  );
}
