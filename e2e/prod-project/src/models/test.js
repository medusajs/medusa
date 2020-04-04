import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

class TestModel extends BaseModel {
  static modelName = "test"

  static schema = {
    title: { type: String, required: true },
  }
}

export default TestModel
