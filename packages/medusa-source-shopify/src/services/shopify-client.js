import { BaseService } from "medusa-interfaces"
import { pager } from "../utils/pager"
import { createClient } from "../utils/create-client"
import { DataType } from "@shopify/shopify-api"

class ShopifyClientService extends BaseService {
  // eslint-disable-next-line no-empty-pattern
  constructor({}, options) {
    super()

    this.options = options

    /** @private @const {ShopifyRestClient} */
    this.client_ = createClient(this.options)
  }

  get(params) {
    return this.client_.get(params)
  }

  async list(path, extraHeaders = null, extraQuery = {}) {
    return await pager(this.client_, path, extraHeaders, extraQuery)
  }

  delete(params) {
    return this.client_.post(params)
  }

  post(params) {
    return this.client_.post({
      path: params.path,
      body: params.body,
      type: DataType.JSON,
    })
  }

  put(params) {
    return this.client_.post(params)
  }
}

export default ShopifyClientService
