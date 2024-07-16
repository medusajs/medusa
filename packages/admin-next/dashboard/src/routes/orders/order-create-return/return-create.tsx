import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import { RouteFocusModal } from "../../../components/modals"
import { ReturnCreateForm } from "./components/return-create-form"

import { useOrder } from "../../../hooks/api/orders"
import { DEFAULT_FIELDS } from "../order-detail/constants"
import { useInitiateReturn } from "../../../hooks/api/returns"

let IS_REQUEST_RUNNING = false

export const ReturnCreate = () => {
  const { id } = useParams()

  const { order } = useOrder(id!, {
    fields: DEFAULT_FIELDS,
  })

  const [activeReturn, setActiveReturn] = useState()
  const { mutateAsync: initiateReturn, isPending } = useInitiateReturn()

  /**
   * TODO: get active return here ??
   */

  useEffect(() => {
    async function run() {
      if (IS_REQUEST_RUNNING || !order) return

      IS_REQUEST_RUNNING = true
      let orderReturn
      try {
        orderReturn = await initiateReturn({ order_id: order.id })
      } catch (e) {
        // TODO: remove this catch
        orderReturn = {
          id: "return_01J2XHSK4DWP2Y6NJBMMRDW497",
          order_id: "order_01J1YDQZVBHNM982M1HV4YVS2G",
          exchange_id: null,
          claim_id: null,
          display_id: 27,
          order_version: 3,
          status: "requested",
          refund_amount: null,
          created_at: "2024-07-16T10:35:45.166Z",
          updated_at: "2024-07-16T10:35:45.166Z",
        }
      }

      setActiveReturn(orderReturn)
      IS_REQUEST_RUNNING = false
    }

    run()
  }, [order])

  return (
    <RouteFocusModal>
      {activeReturn && ( // TODO: && preview
        <ReturnCreateForm
          order={order}
          activeReturn={activeReturn}
          preview={TEMP_PREVIEW}
        />
      )}
    </RouteFocusModal>
  )
}

const TEMP_PREVIEW = {
  id: "order_01J1YDQZVBHNM982M1HV4YVS2G",
  version: 3,
  summary: {
    transaction_total: 0,
    original_order_total: 60,
    current_order_total: 60,
    temporary_difference: 0,
    future_difference: 0,
    future_temporary_difference: 0,
    pending_difference: 60,
    difference_sum: 0,
    paid_total: 0,
    refunded_total: 0,
    raw_transaction_total: {
      value: "0",
      precision: 20,
    },
    raw_original_order_total: {
      value: "60",
      precision: 20,
    },
    raw_current_order_total: {
      value: "60",
      precision: 20,
    },
    raw_temporary_difference: {
      value: "0",
      precision: 20,
    },
    raw_future_difference: {
      value: "0",
      precision: 20,
    },
    raw_future_temporary_difference: {
      value: "0",
      precision: 20,
    },
    raw_pending_difference: {
      value: "60",
      precision: 20,
    },
    raw_difference_sum: {
      value: "0",
      precision: 20,
    },
    raw_paid_total: {
      value: "0",
      precision: 20,
    },
    raw_refunded_total: {
      value: "0",
      precision: 20,
    },
  },
  items: [
    {
      id: "ordli_01J1YDQZVBASHF1TX2HFTMBJTR",
      title: "L",
      subtitle: "Medusa Shorts",
      thumbnail:
        "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png",
      variant_id: "variant_01J1YDD0ACWAJT4V65SVWY8RGK",
      product_id: "prod_01J1YDD0A22YD8CMY10KM8JM2P",
      product_title: "Medusa Shorts",
      product_description:
        "Reimagine the feeling of classic shorts. With our cotton shorts, everyday essentials no longer have to be ordinary.",
      product_subtitle: null,
      product_type: null,
      product_collection: null,
      product_handle: "shorts",
      variant_sku: "SHORTS-L",
      variant_barcode: null,
      variant_title: "L",
      variant_option_values: null,
      requires_shipping: true,
      is_discountable: true,
      is_tax_inclusive: false,
      raw_compare_at_unit_price: null,
      raw_unit_price: {
        value: "10",
        precision: 20,
      },
      metadata: {},
      created_at: "2024-07-04T08:28:30.956Z",
      updated_at: "2024-07-10T13:39:56.054Z",
      tax_lines: [],
      adjustments: [],
      compare_at_unit_price: null,
      unit_price: 10,
      quantity: 5,
      raw_quantity: {
        value: "5",
        precision: 20,
      },
      detail: {
        id: "orditem_01J2EDYH0H6NF8GD9DR904YCQE",
        order_id: "order_01J1YDQZVBHNM982M1HV4YVS2G",
        version: 3,
        item_id: "ordli_01J1YDQZVBASHF1TX2HFTMBJTR",
        raw_quantity: {
          value: "5",
          precision: 20,
        },
        raw_fulfilled_quantity: {
          value: "5",
          precision: 20,
        },
        raw_shipped_quantity: {
          value: "5",
          precision: 20,
        },
        raw_return_requested_quantity: {
          value: "1",
          precision: 20,
        },
        raw_return_received_quantity: {
          value: "0",
          precision: 20,
        },
        raw_return_dismissed_quantity: {
          value: "0",
          precision: 20,
        },
        raw_written_off_quantity: {
          value: "0",
          precision: 20,
        },
        metadata: null,
        created_at: "2024-07-10T13:39:56.053Z",
        updated_at: "2024-07-10T13:39:56.053Z",
        deleted_at: null,
        quantity: 5,
        fulfilled_quantity: 5,
        shipped_quantity: 5,
        return_requested_quantity: 1,
        return_received_quantity: 0,
        return_dismissed_quantity: 0,
        written_off_quantity: 0,
      },
      subtotal: 50,
      total: 50,
      original_total: 50,
      discount_total: 0,
      discount_tax_total: 0,
      tax_total: 0,
      original_tax_total: 0,
      refundable_total_per_unit: 10,
      refundable_total: 40,
      fulfilled_total: 50,
      shipped_total: 50,
      return_requested_total: 10,
      return_received_total: 0,
      return_dismissed_total: 0,
      write_off_total: 0,
      raw_subtotal: {
        value: "50",
        precision: 20,
      },
      raw_total: {
        value: "50",
        precision: 20,
      },
      raw_original_total: {
        value: "50",
        precision: 20,
      },
      raw_discount_total: {
        value: "0",
        precision: 20,
      },
      raw_discount_tax_total: {
        value: "0",
        precision: 20,
      },
      raw_tax_total: {
        value: "0",
        precision: 20,
      },
      raw_original_tax_total: {
        value: "0",
        precision: 20,
      },
      raw_refundable_total_per_unit: {
        value: "10",
        precision: 20,
      },
      raw_refundable_total: {
        value: "40",
        precision: 20,
      },
      raw_fulfilled_total: {
        value: "50",
        precision: 20,
      },
      raw_shipped_total: {
        value: "50",
        precision: 20,
      },
      raw_return_requested_total: {
        value: "10",
        precision: 20,
      },
      raw_return_received_total: {
        value: "0",
        precision: 20,
      },
      raw_return_dismissed_total: {
        value: "0",
        precision: 20,
      },
      raw_write_off_total: {
        value: "0",
        precision: 20,
      },
      actions: [
        {
          id: "ordchact_01J2XJ61005XK0XHPPRAV7QKRK",
          ordering: "11",
          order_id: "order_01J1YDQZVBHNM982M1HV4YVS2G",
          return_id: "return_01J2XHSK4DWP2Y6NJBMMRDW497",
          version: 4,
          order_change_id: "ordch_01J2XHSK4WF9PHSH9SBXJ8PVJA",
          reference: "return",
          reference_id: "return_01J2XHSK4DWP2Y6NJBMMRDW497",
          action: "RETURN_ITEM",
          details: {
            quantity: 1,
            reference_id: "ordli_01J1YDQZVBASHF1TX2HFTMBJTR",
          },
          raw_amount: null,
          internal_note: null,
          applied: false,
          created_at: "2024-07-16T10:42:32.577Z",
          updated_at: "2024-07-16T10:42:32.577Z",
          deleted_at: null,
          order: {
            id: "order_01J1YDQZVBHNM982M1HV4YVS2G",
          },
          return: {
            id: "return_01J2XHSK4DWP2Y6NJBMMRDW497",
          },
          claim: null,
          exchange: null,
          amount: null,
        },
      ],
    },
  ],
  shipping_methods: [
    {
      id: "casm_01J1YDQXB3DJ1760BEJP7G68A0",
      name: "Express Shipping",
      description: null,
      raw_amount: {
        value: "10",
        precision: 20,
      },
      is_tax_inclusive: false,
      shipping_option_id: "so_01J1YDD04DBXQYY54KHBWQW00C",
      data: {},
      metadata: null,
      created_at: "2024-07-04T08:28:28.387Z",
      updated_at: "2024-07-10T13:39:56.054Z",
      deleted_at: null,
      tax_lines: [],
      adjustments: [],
      amount: 10,
      order_id: "order_01J1YDQZVBHNM982M1HV4YVS2G",
      detail: {
        id: "ordspmv_01J2EDYH0J2Q9MCX1HKQMYETG4",
        order_id: "order_01J1YDQZVBHNM982M1HV4YVS2G",
        version: 3,
        shipping_method_id: "casm_01J1YDQXB3DJ1760BEJP7G68A0",
        created_at: "2024-07-04T08:28:30.956Z",
        updated_at: "2024-07-04T08:28:30.956Z",
        deleted_at: null,
      },
      subtotal: 10,
      total: 10,
      original_total: 10,
      discount_total: 0,
      discount_tax_total: 0,
      tax_total: 0,
      original_tax_total: 0,
      raw_subtotal: {
        value: "10",
        precision: 20,
      },
      raw_total: {
        value: "10",
        precision: 20,
      },
      raw_original_total: {
        value: "10",
        precision: 20,
      },
      raw_discount_total: {
        value: "0",
        precision: 20,
      },
      raw_discount_tax_total: {
        value: "0",
        precision: 20,
      },
      raw_tax_total: {
        value: "0",
        precision: 20,
      },
      raw_original_tax_total: {
        value: "0",
        precision: 20,
      },
    },
  ],
  transactions: [],
  order_change: {
    id: "ordch_01J2XHSK4WF9PHSH9SBXJ8PVJA",
    order_id: "order_01J1YDQZVBHNM982M1HV4YVS2G",
    return_id: "return_01J2XHSK4DWP2Y6NJBMMRDW497",
    version: 4,
    change_type: "return",
    status: "pending",
    requested_by: null,
    requested_at: null,
    order: {
      id: "order_01J1YDQZVBHNM982M1HV4YVS2G",
    },
    return: {
      id: "return_01J2XHSK4DWP2Y6NJBMMRDW497",
    },
    claim: null,
    exchange: null,
  },
  total: 60,
  subtotal: 50,
  tax_total: 0,
  discount_total: 0,
  discount_tax_total: 0,
  original_total: 60,
  original_tax_total: 0,
  item_total: 50,
  item_subtotal: 50,
  item_tax_total: 0,
  original_item_total: 50,
  original_item_subtotal: 50,
  original_item_tax_total: 0,
  fulfilled_total: 50,
  shipped_total: 50,
  return_requested_total: 10,
  return_received_total: 0,
  return_dismissed_total: 0,
  write_off_total: 0,
  shipping_total: 10,
  shipping_subtotal: 10,
  shipping_tax_total: 0,
  original_shipping_tax_total: 0,
  original_shipping_tax_subtotal: 10,
  original_shipping_total: 10,
  raw_total: {
    value: "60",
    precision: 20,
  },
  raw_subtotal: {
    value: "50",
    precision: 20,
  },
  raw_tax_total: {
    value: "0",
    precision: 20,
  },
  raw_discount_total: {
    value: "0",
    precision: 20,
  },
  raw_discount_tax_total: {
    value: "0",
    precision: 20,
  },
  raw_original_total: {
    value: "60",
    precision: 20,
  },
  raw_original_tax_total: {
    value: "0",
    precision: 20,
  },
  raw_item_total: {
    value: "50",
    precision: 20,
  },
  raw_item_subtotal: {
    value: "50",
    precision: 20,
  },
  raw_item_tax_total: {
    value: "0",
    precision: 20,
  },
  raw_original_item_total: {
    value: "50",
    precision: 20,
  },
  raw_original_item_subtotal: {
    value: "50",
    precision: 20,
  },
  raw_original_item_tax_total: {
    value: "0",
    precision: 20,
  },
  raw_fulfilled_total: {
    value: "50",
    precision: 20,
  },
  raw_shipped_total: {
    value: "50",
    precision: 20,
  },
  raw_return_requested_total: {
    value: "10",
    precision: 20,
  },
  raw_return_received_total: {
    value: "0",
    precision: 20,
  },
  raw_return_dismissed_total: {
    value: "0",
    precision: 20,
  },
  raw_write_off_total: {
    value: "0",
    precision: 20,
  },
  raw_shipping_total: {
    value: "10",
    precision: 20,
  },
  raw_shipping_subtotal: {
    value: "10",
    precision: 20,
  },
  raw_shipping_tax_total: {
    value: "0",
    precision: 20,
  },
  raw_original_shipping_tax_total: {
    value: "0",
    precision: 20,
  },
  raw_original_shipping_tax_subtotal: {
    value: "10",
    precision: 20,
  },
  raw_original_shipping_total: {
    value: "10",
    precision: 20,
  },
}
