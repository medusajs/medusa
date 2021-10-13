import { BaseService } from "medusa-interfaces"
import mongoose from "mongoose"
import _ from "lodash"

class TransactionService extends BaseService {
  constructor({}) {
    super()
  }

  async createSession() {
    return mongoose.startSession()
  }
}

export default TransactionService
