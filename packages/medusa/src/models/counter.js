import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

class CounterModel extends BaseModel {
  static modelName = "Counter"

  static schema = {
    _id: String,
    next: Number,
  }
}

export default CounterModel
