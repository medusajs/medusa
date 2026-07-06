import { AdminSalesChannel, HttpTypes } from "@medusajs/types";
import {
  Button,
  createDataTableColumnHelper,
  DataTableRowSelectionState,
} from "@medusajs/ui";
import { useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { keepPreviousData } from "@tanstack/react-query";
import { DataTable } from "../../../../../components/data-table";
import * as hooks from "../../../../../components/data-table/helpers/sales-channels";
import {
  StackedFocusModal,
  useStackedModal,
} from "../../../../../components/modals";
import { useSalesChannels } from "../../../../../hooks/api/sales-channels";
import { SC_STACKED_MODAL_ID } from "./schema";
import { ProductCreateSchemaType } from "./types";

type GiftCardProductSalesChannelStackedModalProps = {
  form: UseFormReturn<ProductCreateSchemaType>;
};

const PAGE_SIZE = 50;

export const GiftCardProductSalesChannelStackedModal = ({
  form,
}: GiftCardProductSalesChannelStackedModalProps) => {
  const { getValues, setValue } = form;
  const { setIsOpen, getIsOpen } = useStackedModal();

  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>(
    {}
  );
  const [state, setState] = useState<{ id: string; name: string }[]>([]);

  const searchParams = hooks.useSalesChannelTableQuery({
    pageSize: PAGE_SIZE,
    prefix: SC_STACKED_MODAL_ID,
  });
  const { sales_channels, count, isLoading, isError, error } = useSalesChannels(
    searchParams,
    { placeholderData: keepPreviousData }
  );

  const open = getIsOpen(SC_STACKED_MODAL_ID);

  useEffect(() => {
    if (!open) {
      return;
    }

    const salesChannels = getValues("sales_channels");

    if (salesChannels) {
      setState(
        salesChannels.map((channel) => ({
          id: channel.id,
          name: channel.name,
        }))
      );

      setRowSelection(
        salesChannels.reduce(
          (acc, channel) => ({
            ...acc,
            [channel.id]: true,
          }),
          {}
        )
      );
    }
  }, [open, getValues]);

  const onRowSelectionChange = (state: DataTableRowSelectionState) => {
    const ids = Object.keys(state);

    const addedIdsSet = new Set(
      ids.filter((id) => state[id] && !rowSelection[id])
    );

    let addedSalesChannels: { id: string; name: string }[] = [];

    if (addedIdsSet.size > 0) {
      addedSalesChannels =
        sales_channels?.filter((channel) => addedIdsSet.has(channel.id)) ?? [];
    }

    setState((prev) => {
      const filteredPrev = prev.filter((channel) => state[channel.id]);
      return Array.from(new Set([...filteredPrev, ...addedSalesChannels]));
    });
    setRowSelection(state);
  };

  const handleAdd = () => {
    setValue("sales_channels", state, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setIsOpen(SC_STACKED_MODAL_ID, false);
  };

  const filters = hooks.useSalesChannelTableFilters();
  const columns = useColumns();
  const emptyState = hooks.useSalesChannelTableEmptyState();

  if (isError) {
    throw error;
  }

  return (
    <StackedFocusModal.Content className="flex flex-col overflow-hidden">
      <StackedFocusModal.Header />
      <StackedFocusModal.Body className="flex-1 overflow-hidden">
        <DataTable
          data={sales_channels}
          columns={columns}
          filters={filters}
          emptyState={emptyState}
          rowCount={count}
          pageSize={PAGE_SIZE}
          getRowId={(row: AdminSalesChannel) => row.id}
          rowSelection={{
            state: rowSelection,
            onRowSelectionChange,
          }}
          isLoading={isLoading}
          layout="fill"
          prefix={SC_STACKED_MODAL_ID}
        />
      </StackedFocusModal.Body>
      <StackedFocusModal.Footer>
        <div className="flex items-center justify-end gap-x-2">
          <StackedFocusModal.Close asChild>
            <Button size="small" variant="secondary" type="button">
              Cancel
            </Button>
          </StackedFocusModal.Close>
          <Button size="small" onClick={handleAdd} type="button">
            Save
          </Button>
        </div>
      </StackedFocusModal.Footer>
    </StackedFocusModal.Content>
  );
};

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminSalesChannel>();

const useColumns = () => {
  const base = hooks.useSalesChannelTableColumns();

  return useMemo(() => [columnHelper.select(), ...base], [base]);
};
