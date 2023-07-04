import Shopify from "@shopify/shopify-api"

export const createClient = (options) => {
  const { domain, password } = options

  return new Shopify.Clients.Rest(`${domain}.myshopify.com`, password)
}
