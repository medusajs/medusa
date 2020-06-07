import mongoose from "mongoose"

String.prototype.equals = function(that) {
  return this === that
}

class IdMap {
  ids = {}

  getId(key, backend=false) {
    if (this.ids[key]) {
      return this.ids[key]
    }

    const mongooseId = `${mongoose.Types.ObjectId()}`
    this.ids[key] = mongooseId

    return mongooseId
  }
}

const instance = new IdMap()
export default instance
