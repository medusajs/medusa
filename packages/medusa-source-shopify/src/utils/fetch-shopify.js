import { MedusaError } from "medusa-core-utils"
import axios from "axios"
import { buildQuery } from "./build-query"

function getHeaders(password) {
  return {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": password,
    "X-Shopify-Api-Features": "include-presentment-prices",
  }
}

export async function fetchShopify(options) {
  const {
    password,
    domain,
    productsQuery,
    customCollectionsQuery,
    smartCollectionsQuery,
    collectsQuery,
  } = options

  console.log(password)

  const headers = getHeaders(password)

  let shopify = {}

  shopify.products = await fetchAllProducts(productsQuery, domain, headers)
  shopify.customCollections = await fetchCustomCollections(
    customCollectionsQuery,
    domain,
    headers
  )
  shopify.smartCollections = await fetchSmartCollections(
    smartCollectionsQuery,
    domain,
    headers
  )
  shopify.collects = await fetchCollects(collectsQuery, domain, headers)

  return shopify
}

async function fetchAllProducts(query, domain, headers) {
  const path = buildQuery(query)

  return await axios
    .get(
      `https://${domain}.myshopify.com/admin/api/2021-07/products.json${path}`,
      {
        headers,
      }
    )
    .then((res) => {
      return res.data.products
    })
    .catch((error) => {
      console.log(error)
      throw new MedusaError(MedusaError.Types.INVALID_DATA, {
        message: `Shopify: ${error.message}`,
      })
    })
}

async function fetchSmartCollections(query, domain, headers) {
  const path = buildQuery(query)

  return await axios
    .get(
      `https://${domain}.myshopify.com/admin/api/2021-07/smart_collections.json${path}`,
      {
        headers,
      }
    )
    .then((res) => {
      return res.data.smart_collections
    })
    .catch((error) => {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, {
        message: `Shopify: ${error.message}`,
      })
    })
}

async function fetchCustomCollections(query, domain, headers) {
  const path = buildQuery(query)

  return await axios
    .get(
      `https://${domain}.myshopify.com/admin/api/2021-07/custom_collections.json${path}`,
      {
        headers,
      }
    )
    .then((response) => {
      return response.data.custom_collections
    })
    .catch((error) => {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, {
        message: `Shopify: ${error.message}`,
      })
    })
}

async function fetchCollects(query, domain, headers) {
  const path = buildQuery(query)

  return await axios
    .get(
      `https://${domain}.myshopify.com/admin/api/2021-07/collects.json${path}`,
      {
        headers,
      }
    )
    .then((response) => {
      return response.data.collects
    })
    .catch((error) => {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, {
        message: `Shopify: ${error.message}`,
      })
    })
}
