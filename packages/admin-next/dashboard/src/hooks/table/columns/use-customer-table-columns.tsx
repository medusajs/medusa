import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"

import { AdminCustomerResponse } from "@medusajs/types"
import {
  EmailCell,
  EmailHeader,
} from "../../../components/table/table-cells/common/email-cell"
import {
  NameCell,
  NameHeader,
} from "../../../components/table/table-cells/common/name-cell"
import {
  AccountCell,
  AccountHeader,
} from "../../../components/table/table-cells/customer/account-cell/account-cell"
import {
  FirstSeenCell,
  FirstSeenHeader,
} from "../../../components/table/table-cells/customer/first-seen-cell"

const columnHelper = createColumnHelper<AdminCustomerResponse["customer"]>()

export const useCustomerTableColumns = () => {
  return useMemo(
    () => [
      columnHelper.accessor("email", {
        header: () => <EmailHeader />,
        cell: ({ getValue }) => <EmailCell email={getValue()} />,
      }),
      columnHelper.display({
        id: "name",
        header: () => <NameHeader />,
        cell: ({
          row: {
            original: { first_name, last_name },
          },
        }) => <NameCell firstName={first_name} lastName={last_name} />,
      }),
      columnHelper.accessor("has_account", {
        header: () => <AccountHeader />,
        cell: ({ getValue }) => <AccountCell hasAccount={getValue()} />,
      }),
      columnHelper.accessor("created_at", {
        header: () => <FirstSeenHeader />,
        cell: ({ getValue }) => <FirstSeenCell createdAt={getValue()} />,
      }),
    ],
    []
  )
}
