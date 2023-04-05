import { Cart, Order } from "@medusajs/medusa"

/**
 * Utility for extracting the customer name from a cart or order.
 */
const extractCustomerName = (obj?: Cart | Order) => {
  if (!obj) {
    return "N/A"
  }

  if (obj.customer) {
    const firstName = obj.customer.first_name
    const lastName = obj.customer.last_name

    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    }

    if (firstName) {
      return firstName
    }

    if (lastName) {
      return lastName
    }
  }

  if (obj.shipping_address) {
    const firstName = obj.shipping_address.first_name
    const lastName = obj.shipping_address.last_name

    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    }

    if (firstName) {
      return firstName
    }

    if (lastName) {
      return lastName
    }
  }

  if (obj.billing_address) {
    const firstName = obj.billing_address.first_name
    const lastName = obj.billing_address.last_name

    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    }

    if (firstName) {
      return firstName
    }

    if (lastName) {
      return lastName
    }
  }

  if (obj.email) {
    return obj.email
  }

  return "N/A"
}

export default extractCustomerName
