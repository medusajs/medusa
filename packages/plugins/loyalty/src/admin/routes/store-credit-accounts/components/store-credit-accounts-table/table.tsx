import { Container } from "@medusajs/ui";
import { Fragment } from "react";
import { Outlet } from "react-router-dom";

import { AdminStoreCreditAccount } from "../../../../../types";
import { DataTable } from "../../../../components/data-table";
import { useStoreCreditAccounts } from "../../../../hooks/api/store-credit-accounts";
import { useStoreCreditAccountTableColumns } from "./columns";
import { useStoreCreditAccountFilters } from "./filters";
import { useStoreCreditAccountsTableQuery } from "./query";

const PAGE_SIZE = 10;

export function StoreCreditAccountsTable() {
  const queryParams = useStoreCreditAccountsTableQuery({
    pageSize: PAGE_SIZE,
  });

  const {
    store_credit_accounts: storeCreditAccounts,
    isPending,
    count,
  } = useStoreCreditAccounts({
    ...queryParams,
    order: queryParams.order ?? "-created_at",
  });

  const columns = useStoreCreditAccountTableColumns();
  const filters = useStoreCreditAccountFilters();

  return (
    <Fragment>
      <Container className="p-0">
        <DataTable
          data={storeCreditAccounts ?? []}
          getRowId={(row: AdminStoreCreditAccount) => row.id}
          columns={columns}
          filters={filters}
          isLoading={isPending}
          pageSize={PAGE_SIZE}
          rowCount={count}
          enableSearch={false}
          heading="Store Credit Accounts"
          rowHref={(row: AdminStoreCreditAccount) => `${row.id}`}
          emptyState={{
            empty: {
              heading: "No store credit accounts found",
              description: "Create a new store credit account to get started.",
            },
            filtered: {
              heading: "No results found",
              description:
                "No store credit accounts match your filter criteria.",
            },
          }}
          actions={[
            {
              label: "Create",
              to: "/store-credit-accounts/create",
            },
          ]}
        />
      </Container>

      <Outlet />
    </Fragment>
  );
}
