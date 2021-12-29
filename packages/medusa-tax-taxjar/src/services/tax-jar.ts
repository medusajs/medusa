import {
  ITaxService,
  TaxCalculationContext,
  ItemTaxCalculationLine,
  ShippingTaxCalculationLine,
  ProviderTaxLine,
} from "@medusajs/medusa"
import Taxjar from "taxjar"

class TaxJarService implements ITaxService {
  constructor({}, options) {
    this.options_ = options
    this.client_ = new Taxjar({
      apiKey: options.api_key,
    })
  }

  async getTaxLines(
    itemLines: ItemTaxCalculationLine,
    shippingLines: ShippingTaxCalculationLine,
    context: TaxCalculationContext
  ) {
    const response = await this.client_.taxForOrder({
      from_country: this.options_.from_country,
      from_zip: this.options_.from_zip,
      from_state: this.options_.from_state,
      from_city: this.options_.from_city,
      from_street: this.options_.from_street,
      to_country: context.shipping_address.country_code,
      to_zip: context.shipping_address.postal_code,
      to_state: context.shipping_address.province,
      to_city: context.shipping_address.city,
      to_street: context.shipping_address.address_1,
      shipping: shippingLines.reduce(
        (acc, next) => acc + next.shipping_method.price,
        0
      ),
      line_items: itemLines.map(({ item, rates }) => {
        return {
          id: item.id,
          quantity: item.quantity,
          product_tax_code: rates[0].code,
          unit_price: item.unit_price,
          discount: context.allocation_map[item.id].discount?.amount || 0,
        }
      }),
    })

    let taxLinesToReturn: ProviderTaxLine[] = []

    if (typeof response.tax.breakdown.line_items !== "undefined") {
      const itemTaxLines = response.tax.breakdown.line_items.flatMap((li) => {
        const toReturn = []

        if (li.state_sales_tax_rate) {
          toReturn.push({
            item_id: li.id,
            code: "state_tax",
            name: "State Tax",
            rate: li.state_sales_tax_rate * 100,
          })
        }

        if (li.county_tax_rate) {
          toReturn.push({
            item_id: li.id,
            code: "county_tax",
            name: "County Tax",
            rate: li.county_tax_rate * 100,
          })
        }

        if (li.city_tax_rate) {
          toReturn.push({
            item_id: li.id,
            code: "city_tax",
            name: "City Tax",
            rate: li.city_tax_rate * 100,
          })
        }

        if (li.special_tax_rate) {
          toReturn.push({
            item_id: li.id,
            code: "special_tax",
            name: "Special Tax",
            rate: li.special_tax_rate * 100,
          })
        }

        return toReturn
      })

      taxLinesToReturn = taxLinesToReturn.concat(itemTaxLines)
    }

    if (typeof response.tax.breakdown.shipping !== "undefined") {
      const sl = response.tax.breakdown.shipping
      const shippingTaxLines = shippingLines.map(({ shipping_method }) => {
        const toReturn = []
        if (sl.state_sales_tax_rate) {
          toReturn.push({
            shipping_method_id: shipping_method.id,
            code: "state_tax",
            name: "State Tax",
            rate: sl.state_sales_tax_rate * 100,
          })
        }

        if (sl.county_tax_rate) {
          toReturn.push({
            item_id: sl.id,
            code: "county_tax",
            name: "County Tax",
            rate: sl.county_tax_rate * 100,
          })
        }

        if (sl.city_tax_rate) {
          toReturn.push({
            item_id: sl.id,
            code: "city_tax",
            name: "City Tax",
            rate: sl.city_tax_rate * 100,
          })
        }

        if (sl.special_tax_rate) {
          toReturn.push({
            item_id: sl.id,
            code: "special_tax",
            name: "Special Tax",
            rate: sl.special_tax_rate * 100,
          })
        }

        return toReturn
      })

      taxLinesToReturn = taxLinesToReturn.concat(shippingTaxLines)
    }

    return taxLinesToReturn
  }
}

export default TaxJarService
