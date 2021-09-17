import axios from "axios"

const DOMAIN = "desaucestore"
const PASSWORD = process.env.SHOPIFY_PASSWORD || "temp"

const headers = {
  "Content-Type": "application/json",
  "X-Shopify-Access-Token": PASSWORD,
}

export async function fetchAllProducts(query) {
  return await axios.get(
    `https://${DOMAIN}.myshopify.com/admin/api/2021-07/products.json`,
    {
      headers,
    }
  )
}

export async function fetchSmartCollections(query) {
  return await axios
    .get(
      `https://${DOMAIN}.myshopify.com/admin/api/2021-07/smart_collections.json`,
      {
        headers,
      }
    )
    .then((res) => {
      return res.data.smart_collections
    })
    .catch((error) => {
      console.log(error)
    })
}

export async function fetchCustomCollections(query) {
  return await axios.get(
    `https://${DOMAIN}.myshopify.com/admin/api/2021-07/custom_collections.json`,
    {
      headers,
    }
  )
}

export async function fetchCollectionProducts(collection_id, query) {
  return await axios.get(
    `https://${DOMAIN}.myshopify.com/admin/api/2021-07/${collection_id}/products.json`,
    {
      headers,
    }
  )
}
