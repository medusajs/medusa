import { Container } from "@medusajs/ui";
import { Fragment } from "react";
import { Outlet } from "react-router-dom";

import { AdminTransaction } from "../../../../../../types";
import { DataTable } from "../../../../../components/data-table";
import { useStoreCreditAccountTransactions } from "../../../../../hooks/api/transactions";
import { useTransactionsTableColumns } from "./columns";
import { useTransactionsTableFilters } from "./filters";
import { useTransactionsTableQuery } from "./query";

const PAGE_SIZE = 10;

export function TransactionsTable({ id }: { id: string }) {
  const queryParams = useTransactionsTableQuery({
    pageSize: PAGE_SIZE,
  });

  const { transactions, isLoading, count } = useStoreCreditAccountTransactions(
    id!,
    {
      ...queryParams,
      order: queryParams.order ?? "-created_at",
      fields: "*account",
    }
  );

  const columns = useTransactionsTableColumns();
  const filters = useTransactionsTableFilters({});

  return (
    <Fragment>
      <Container className="p-0">
        <DataTable
          data={transactions ?? []}
          getRowId={(row: AdminTransaction) => row.id}
          columns={columns}
          filters={filters}
          isLoading={isLoading}
          pageSize={PAGE_SIZE}
          rowCount={count}
          enableSearch={false}
          heading="Transactions"
          emptyState={{
            empty: {
              heading: "No transactions found",
            },
            filtered: {
              heading: "No results found",
              description: "No transactions match your filter criteria.",
            },
          }}
        />
      </Container>

      <Outlet />
    </Fragment>
  );
}
