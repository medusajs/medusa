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
})
