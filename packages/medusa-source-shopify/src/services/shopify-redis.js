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
    const key = `sh_${id}_ignore_${side}`
    return await this.redis_.set(
      key,
      1,
      "EX",
      this.options_.ignore_threshold || IGNORE_THRESHOLD
    )
  }

  async shouldIgnore(id, action) {
    const key = `sh_${id}_ignore_${action}`
    return await this.redis_.get(key)
  }

  async addUniqueValue(uniqueVal, type) {
    const key = `sh_${uniqueVal}_${type}`
    return await this.redis_.set(key, 1, "EX", 60 * 5)
  }

  async getUniqueValue(uniqueVal, type) {
    const key = `sh_${uniqueVal}_${type}`
    return await this.redis_.get(key)
  }
}

export default shopifyRedisService
