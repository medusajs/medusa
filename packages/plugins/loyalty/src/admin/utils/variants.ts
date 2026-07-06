import { HttpTypes } from "@medusajs/types";
import { ProductCreateSchemaType } from "../routes/gift-cards/gift-card-products/components/gift-card-product-create-form/types";
import { castNumber } from "./validations";

export const normalizeProductFormValues = (
  values: ProductCreateSchemaType & {
    status: HttpTypes.AdminProductStatus;
    regionsCurrencyMap: Record<string, string>;
  }
): HttpTypes.AdminCreateProduct => {
  const thumbnail = values.media?.find((media) => media.isThumbnail)?.url;
  const images = values.media
    ?.filter((media) => !media.isThumbnail)
    .map((media) => ({ url: media.url }));

  const optionValues = values.denominations.map(
    (denomination) => denomination.value
  );

  const options = [
    {
      title: "denomination",
      values: optionValues,
    },
  ];

  const variants = values.denominations.map((denomination) => ({
    title: denomination.value,
    options: {
      denomination: denomination.value,
    },
    prices: denomination.prices,
  }));

  return {
    status: values.status,
    tags: values?.tags?.length
      ? values.tags?.map((tag) => ({ id: tag }))
      : undefined,
    sales_channels: values?.sales_channels?.length
      ? values.sales_channels?.map((sc) => ({ id: sc.id }))
      : undefined,
    images,
    is_giftcard: true,
    collection_id: values.collection_id || undefined,
    shipping_profile_id: values.shipping_profile_id || undefined,
    categories: values.categories.map((id) => ({ id })),
    type_id: values.type_id || undefined,
    handle: values.handle || undefined,
    origin_country: values.origin_country || undefined,
    material: values.material || undefined,
    mid_code: values.mid_code || undefined,
    hs_code: values.hs_code || undefined,
    thumbnail,
    title: values.title,
    subtitle: values.subtitle || undefined,
    description: values.description || undefined,
    discountable: values.discountable || undefined,
    width: values.width ? parseFloat(values.width) : undefined,
    length: values.length ? parseFloat(values.length) : undefined,
    height: values.height ? parseFloat(values.height) : undefined,
    weight: values.weight ? parseFloat(values.weight) : undefined,
    options,
    variants: normalizeVariants(variants, values.regionsCurrencyMap),
  };
};

export const normalizeVariants = (
  variants: ProductCreateSchemaType["variants"],
  regionsCurrencyMap: Record<string, string>
): HttpTypes.AdminCreateProductVariant[] => {
  return variants.map((variant, i) => ({
    title: variant.title,
    options: variant.options,
    manage_inventory: false,
    allow_backorder: true,
    variant_rank: i,
    prices: Object.entries(variant.prices || {})
      .map(([key, value]: any) => {
        if (value === "" || value === undefined) {
          return undefined;
        }

        if (key.startsWith("reg_")) {
          return {
            currency_code: regionsCurrencyMap[key],
            amount: castNumber(value),
            rules: { region_id: key },
          };
        } else {
          return {
            currency_code: key,
            amount: castNumber(value),
          };
        }
      })
      .filter((v) => !!v),
  }));
};

export const decorateVariantsWithDefaultValues = (
  variants: ProductCreateSchemaType["variants"]
) => {
  return variants.map((variant) => ({
    ...variant,
    title: variant.title || "",
    manage_inventory: variant.manage_inventory || false,
    allow_backorder: variant.allow_backorder || false,
    inventory_kit: variant.inventory_kit || false,
  }));
};
