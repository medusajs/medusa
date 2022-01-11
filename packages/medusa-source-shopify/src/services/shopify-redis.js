// shopify-redis
import { BaseService } from "medusa-interfaces"
import { IGNORE_THRESHOLD } from "../utils/const"

class shopifyRedisService extends BaseService {
  constructor({ redisClient }, options) {
    super()

    this.options_ = options

    /** @private @const {RedisClient} */
    this.redis_ = redisClient
  }

  async addIgnore(id, side) {
    const key = `${id}_ignore_${side}`
    return await this.redis_.set(
      key,
      1,
      "EX",
      this.options_.ignore_threshold || IGNORE_THRESHOLD
    )
  }

  async shouldIgnore(id, action) {
    const key = `${id}_ignore_${action}`
    return await this.redis_.get(key)
  }

  async addUniqueValue(uniqueVal) {
    return await this.redis_.set(uniqueVal, 1, "EX", 60 * 5)
  }

  async getUniqueValue(uniqueVal) {
    return await this.redis_.get(uniqueVal)
  }
}

export default shopifyRedisService
