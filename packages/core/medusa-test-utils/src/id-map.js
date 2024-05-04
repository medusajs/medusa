import randomize from "randomatic"

class IdMap {
  ids = {}

  getId(key, prefix = "", length = 10) {
    if (this.ids[key]) {
      return this.ids[key]
    }

    const id = `${prefix && prefix + "_"}${randomize("Aa0", length)}`
    this.ids[key] = id

    return id
  }
}

const instance = new IdMap()
export default instance
