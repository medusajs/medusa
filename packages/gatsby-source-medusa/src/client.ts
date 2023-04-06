import axios, { AxiosPromise, AxiosRequestConfig } from "axios"

function medusaRequest(
  storeURL: string,
  path = "",
  headers = {}
): AxiosPromise {
  const options: AxiosRequestConfig = {
    method: "GET",
    withCredentials: true,
    url: path,
    headers: headers,
  }

  const client = axios.create({ baseURL: storeURL })

  return client(options)
}

export const createClient = (options: MedusaPluginOptions): any => {
  const { storeUrl, apiKey } = options

  /**
   * @param {string} _date used fetch products updated since the specified date
   * @return {Promise<any[]>}  products to create nodes from
   */
  async function products(_date?: string): Promise<any[]> {
    let products: any[] = []
    let offset = 0
    let count = 1
    do {
      let path = `/store/products?offset=${offset}`
      if (_date) {
        path += `&updated_at[gt]=${_date}`
      }

      await medusaRequest(storeUrl, path).then(({ data }) => {
        products = [...products, ...data.products]
        count = data.count
        offset = data.products.length
      })
    } while (products.length < count)

    if (!products.length && !_date) {
      console.warn(
        "[gatsby-source-medusa]: 📣 No products were retrieved. If this is a new store, please ensure that you have at least one published product in your store. You can create a product by using the Medusa admin dashboard."
      )
    }

    return products
  }

  /**
   *
   * @param {string} _date used fetch regions updated since the specified date
   * @return {Promise<any[]>} regions to create nodes from
   */
  async function regions(_date?: string): Promise<any[]> {
    let path = `/store/regions`
    if (_date) {
      path += `?updated_at[gt]=${_date}`
    }

    const regions = await medusaRequest(storeUrl, path).then(({ data }) => {
      return data.regions
    })

    if (!regions.length && !_date) {
      console.warn(
        "[gatsby-source-medusa]: 📣 No regions were retrieved. If this is a new store, please ensure that you have configured at least one region in the Medusa admin dashboard."
      )
    }

    return regions
  }

  /**
   *
   * @param {string} _date used fetch regions updated since the specified date
   * @return {Promise<any[]>} orders to create nodes from
   */
  async function orders(_date?: string): Promise<any[]> {
    const orders = await medusaRequest(storeUrl, `/admin/orders`, {
      Authorization: `Bearer ${apiKey}`,
    })
      .then(({ data }) => {
        return data.orders
      })
      .catch((error) => {
        console.warn(`
            📣 The following error status was produced while attempting to fetch orders: ${error}. \n
            Make sure that the auth token you provided is valid.
      `)
        return []
      })
    return orders
  }

  /**
   *
   * @param {string} _date used fetch regions updated since the specified date
   * @return {Promise<any[]>} collections to create nodes from
   */
  async function collections(_date?: string): Promise<any[]> {
    let collections: any[] = []
    let offset = 0
    let count = 1
    do {
      let path = `/store/collections?offset=${offset}`
      if (_date) {
        path += `&updated_at[gt]=${_date}`
      }
      await medusaRequest(storeUrl, path).then(({ data }) => {
        collections = [...collections, ...data.collections]
        count = data.count
        offset = data.collections.length
      })
    } while (collections.length < count)

    if (!collections.length && !_date) {
      console.warn(
        "[gatsby-source-medusa]: 📣 No collections were retrieved. You can create collections using the Medusa admin dasbboard."
      )
    }

    return collections
  }

  return {
    products,
    collections,
    regions,
    orders,
  }
}
