import mongoose from "mongoose"

class IdMap {
  ids = {}

  getId(key) {
    if (this.ids[key]) {
      return this.ids[key]
    }
    const id = `${mongoose.Types.ObjectId()}`
    this.ids[key] = id
    return id
  }
}

const instance = new IdMap()
export default instance
