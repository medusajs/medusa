import { BaseService } from "medusa-interfaces"

import { IGNORE_THRESHOLD } from "../utils/const"

class ShopifyCacheService extends BaseService {
  constructor({ cacheService }, options) {
    super()

    this.options_ = options

    /** @private @const {ICacheService} */
    this.cacheService_ = cacheService
  }

  async addIgnore(id, side) {
    const key = `sh_${id}_ignore_${side}`
    return await this.cacheService_.set(
      key,
      1,
      this.options_.ignore_threshold || IGNORE_THRESHOLD
    )
  }

  async shouldIgnore(id, action) {
    const key = `sh_${id}_ignore_${action}`
    return await this.cacheService_.get(key)
  }

  async addUniqueValue(uniqueVal, type) {
    const key = `sh_${uniqueVal}_${type}`
    return await this.cacheService_.set(key, 1, 60 * 5)
  }

  async getUniqueValue(uniqueVal, type) {
    const key = `sh_${uniqueVal}_${type}`
    return await this.cacheService_.get(key)
  }
}

export default ShopifyCacheService
