import { HttpTypes } from "@medusajs/types";
import { useMemo } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import {
  createDataGridHelper,
  createDataGridPriceColumns,
  DataGrid,
} from "../../../../../../components/data-grid";
import { useRouteModal } from "../../../../../../components/modals";
import { usePricePreferences } from "../../../../../../hooks/api/price-preferences";
import { useRegions } from "../../../../../../hooks/api/regions";
import { useStore } from "../../../../../../hooks/api/store";
import { ProductCreateSchemaType } from "../../../components/gift-card-product-create-form/types";

type VariantPricingFormProps = {
  form: UseFormReturn<ProductCreateSchemaType>;
};

export const VariantPricingForm = ({ form }: VariantPricingFormProps) => {
  const { store } = useStore();
  const { regions } = useRegions({ limit: 9999 });
  const { price_preferences: pricePreferences } = usePricePreferences({});

  const { setCloseOnEscape } = useRouteModal();

  const columns = useVariantPriceGridColumns({
    currencies: store?.supported_currencies,
    regions,
    pricePreferences,
  });

  const variants = useWatch({
    control: form.control,
    name: "variants",
  }) as any;

  return (
    <DataGrid
      columns={columns}
      data={variants}
      state={form}
      onEditingChange={(editing) => setCloseOnEscape(!editing)}
    />
  );
};

const columnHelper = createDataGridHelper<
  HttpTypes.AdminProductVariant,
  ProductCreateSchemaType
>();

const useVariantPriceGridColumns = ({
  currencies = [],
  regions = [],
  pricePreferences = [],
}: {
  currencies?: HttpTypes.AdminStore["supported_currencies"];
  regions?: HttpTypes.AdminRegion[];
  pricePreferences?: HttpTypes.AdminPricePreference[];
}) => {
  return useMemo(() => {
    return [
      columnHelper.column({
        id: "Title",
        header: "Title",
        cell: (context) => {
          const entity = context.row.original;
          return (
            <DataGrid.ReadonlyCell context={context}>
              <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                <span className="truncate">{entity.title}</span>
              </div>
            </DataGrid.ReadonlyCell>
          );
        },
        disableHiding: true,
      }),
      ...createDataGridPriceColumns<
        HttpTypes.AdminProductVariant,
        ProductCreateSchemaType
      >({
        currencies: currencies.map((c) => c.currency_code),
        regions,
        pricePreferences,
        getFieldName: (context, value) => {
          return `variants.${context.row.index}.prices.${value}`;
        },
      }),
    ];
  }, [currencies, regions, pricePreferences]);
};
