import { Address } from "@medusajs/medusa"
import { AddressCreatePayload } from "@medusajs/medusa/dist/types/common"
import React, { FC, HTMLAttributes } from "react"

export interface FormattedAddressProps extends HTMLAttributes<HTMLDivElement> {
  address?: Address | AddressCreatePayload | null
}

export const FormattedAddress: FC<FormattedAddressProps> = ({
  address,
  ...props
}) => (
  <div {...props}>
    {!address && <>N/A</>}

    {address && (
      <>
        <div>
          {address.first_name} {address.last_name}
        </div>
        {address.company && <div>{address.company}</div>}
        <div className="flex flex-col">
          <span>
            {address.address_1}
            {address.address_2 && `, ${address.address_2}`}
          </span>
          <span>
            {address.city}, {`${address.province} ` || ""}
            {address.postal_code} {address.country_code?.toUpperCase()}
          </span>
        </div>
      </>
    )}
  </div>
)
