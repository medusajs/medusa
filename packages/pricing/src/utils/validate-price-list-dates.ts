import { isDate, MedusaError } from "@medusajs/utils"

export const validatePriceListDates = (priceListData: {
  starts_at?: Date | string | null
  ends_at?: Date | string | null
}) => {
  if (
    typeof priceListData.starts_at === "string" &&
    !isDate(priceListData.starts_at)
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Cannot set price list starts at with with invalid date string: ${priceListData.starts_at}`
    )
  }

  if (
    typeof priceListData.ends_at === "string" &&
    !isDate(priceListData.ends_at)
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Cannot set price list ends at with with invalid date string: ${priceListData.ends_at}`
    )
  }
}
