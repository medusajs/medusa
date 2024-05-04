import React from "react"
import {
  useAdminCreateDiscount,
} from "medusa-react"
import {
  AllocationType,
  DiscountRuleType,
} from "@medusajs/medusa"

const CreateDiscount = () => {
  const createDiscount = useAdminCreateDiscount()
  // ...

  const handleCreate = (
    currencyCode: string,
    regionId: string
  ) => {
    // ...
    createDiscount.mutate({
      code: currencyCode,
      rule: {
        type: DiscountRuleType.FIXED,
        value: 10,
        allocation: AllocationType.ITEM,
      },
      regions: [
          regionId,
      ],
      is_dynamic: false,
      is_disabled: false,
    })
  }

  // ...
}

export default CreateDiscount
