import { deepFlatMap } from "../deep-flat-map"

describe("deepFlatMap", function () {
  it("should return flat map of nested objects", function () {
    const data = [
      {
        id: "sales_channel_1",
        stock_locations: [
          {
            id: "location_1",
            fulfillment_sets: [
              {
                id: "fset_1",
                name: "Test 123",
                service_zones: [
                  {
                    id: "zone_123",
                    shipping_options: [
                      {
                        id: "so_zone_123 1111",
                        calculated_price: {
                          calculated_amount: 3000,
                        },
                      },
                      {
                        id: "so_zone_123 22222",
                        calculated_price: {
                          calculated_amount: 6000,
                        },
                      },
                    ],
                  },
                  {
                    id: "zone_567",
                    shipping_options: [
                      {
                        id: "zone 567 11111",
                        calculated_price: {
                          calculated_amount: 1230,
                        },
                      },
                      {
                        id: "zone 567 22222",
                        calculated_price: {
                          calculated_amount: 1230,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "location_2",
            fulfillment_sets: [
              {
                id: "fset_2",
                name: "fset name 2",
                service_zones: [
                  {
                    id: "zone_ABC",
                    shipping_options: [
                      {
                        id: "zone_abc_unique",
                        calculated_price: {
                          calculated_amount: 70,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        id: "sales_channel_2",
        stock_locations: [
          {
            id: "location_5",
            fulfillment_sets: [
              {
                id: "fset_aaa",
                name: "Test aaa",
                service_zones: [
                  {
                    id: "zone_aaa",
                    shipping_options: [
                      {
                        id: "so_zone_aaa aaaa",
                        calculated_price: {
                          calculated_amount: 500,
                        },
                      },
                      {
                        id: "so_zone_aaa bbbb",
                        calculated_price: {
                          calculated_amount: 12,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]

    const result = deepFlatMap(
      data,
      "stock_locations.fulfillment_sets.service_zones.shipping_options.calculated_price",
      ({
        root_,
        stock_locations,
        fulfillment_sets,
        service_zones,
        shipping_options,
        calculated_price,
      }) => {
        return {
          sales_channel_id: root_.id,
          stock_location_id: stock_locations.id,
          fulfillment_set_id: fulfillment_sets.id,
          fulfillment_set_name: fulfillment_sets.name,
          service_zone_id: service_zones.id,
          shipping_option_id: shipping_options.id,
          price: calculated_price.calculated_amount,
        }
      }
    )

    expect(result).toEqual([
      {
        sales_channel_id: "sales_channel_1",
        stock_location_id: "location_1",
        fulfillment_set_id: "fset_1",
        fulfillment_set_name: "Test 123",
        service_zone_id: "zone_123",
        shipping_option_id: "so_zone_123 1111",
        price: 3000,
      },
      {
        sales_channel_id: "sales_channel_1",
        stock_location_id: "location_1",
        fulfillment_set_id: "fset_1",
        fulfillment_set_name: "Test 123",
        service_zone_id: "zone_123",
        shipping_option_id: "so_zone_123 22222",
        price: 6000,
      },
      {
        sales_channel_id: "sales_channel_1",
        stock_location_id: "location_1",
        fulfillment_set_id: "fset_1",
        fulfillment_set_name: "Test 123",
        service_zone_id: "zone_567",
        shipping_option_id: "zone 567 11111",
        price: 1230,
      },
      {
        sales_channel_id: "sales_channel_1",
        stock_location_id: "location_1",
        fulfillment_set_id: "fset_1",
        fulfillment_set_name: "Test 123",
        service_zone_id: "zone_567",
        shipping_option_id: "zone 567 22222",
        price: 1230,
      },
      {
        sales_channel_id: "sales_channel_1",
        stock_location_id: "location_2",
        fulfillment_set_id: "fset_2",
        fulfillment_set_name: "fset name 2",
        service_zone_id: "zone_ABC",
        shipping_option_id: "zone_abc_unique",
        price: 70,
      },
      {
        sales_channel_id: "sales_channel_2",
        stock_location_id: "location_5",
        fulfillment_set_id: "fset_aaa",
        fulfillment_set_name: "Test aaa",
        service_zone_id: "zone_aaa",
        shipping_option_id: "so_zone_aaa aaaa",
        price: 500,
      },
      {
        sales_channel_id: "sales_channel_2",
        stock_location_id: "location_5",
        fulfillment_set_id: "fset_aaa",
        fulfillment_set_name: "Test aaa",
        service_zone_id: "zone_aaa",
        shipping_option_id: "so_zone_aaa bbbb",
        price: 12,
      },
    ])
  })

  it("should invoke the callback when the terminal segment is an empty array", function () {
    const data = {
      locations: [
        {
          id: "location_1",
          sales_channels: [],
        },
      ],
    }

    const contexts: Record<string, any>[] = []

    deepFlatMap(data, "locations.sales_channels", (context) => {
      contexts.push(context)
    })

    expect(contexts).toEqual([
      {
        root_: data,
        locations: data.locations[0],
      },
    ])
  })

  it("should invoke the callback when an intermediate segment is an empty array", function () {
    const data = {
      locations: [],
    }

    const contexts: Record<string, any>[] = []

    deepFlatMap(data, "locations.sales_channels", (context) => {
      contexts.push(context)
    })

    expect(contexts).toEqual([{ root_: data }])
  })

  describe("call-site contracts", function () {
    // cancel-order.ts and refund-captured-payments.ts map the terminal segment
    // straight into the results array and then read properties off each entry,
    // so an empty terminal array must not contribute an entry.
    it("should not add an entry to the results for an empty terminal array", function () {
      const order = {
        payment_collections: [
          { id: "pay_col_1", payments: [{ id: "pay_1", captures: [] }] },
          { id: "pay_col_2", payments: [] },
        ],
      }

      const payments = deepFlatMap(
        order,
        "payment_collections.payments",
        ({ payments }) => payments
      )

      expect(payments).toEqual([{ id: "pay_1", captures: [] }])
      expect(() =>
        payments.filter((payment) => payment.captures.length === 0)
      ).not.toThrow()
    })

    // exchange-request-item-return.ts and claim-request-item-return.ts pick the
    // first location id off the terminal segment.
    it("should not pick a location id when the terminal location levels are empty", function () {
      const item = {
        variant: {
          inventory_items: [{ inventory: [{ location_levels: [] }] }],
        },
      }

      let locationId: string | undefined
      deepFlatMap(
        item,
        "variant.inventory_items.inventory.location_levels",
        ({ location_levels }) => {
          if (!locationId && location_levels?.location_id) {
            locationId = location_levels.location_id
          }
        }
      )

      expect(locationId).toBeUndefined()
    })

    it("should pick the first location id when the terminal location levels are present", function () {
      const item = {
        variant: {
          inventory_items: [
            {
              inventory: [
                {
                  location_levels: [
                    { location_id: "sl_1" },
                    { location_id: "sl_2" },
                  ],
                },
              ],
            },
          ],
        },
      }

      let locationId: string | undefined
      deepFlatMap(
        item,
        "variant.inventory_items.inventory.location_levels",
        ({ location_levels }) => {
          if (!locationId && location_levels?.location_id) {
            locationId = location_levels.location_id
          }
        }
      )

      expect(locationId).toEqual("sl_1")
    })
  })
})
