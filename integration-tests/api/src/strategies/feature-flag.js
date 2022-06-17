import { AbstractFeatureFlagStrategy } from "@medusajs/medusa"
import { writeFile, readFile } from "fs"

class FeatureFlagStrategy extends AbstractFeatureFlagStrategy {
  FEATURE_FILE = "./features.json"

  // eslint-disable-next-line no-empty-pattern
  constructor({}) {
    super({})

    writeFile("./features.json", "{}", function (err) {})
  }

  isSet(flagname) {
    console.log(flagname)
    console.log("flagname")
    readFile("./features.json", function (err, data) {
      console.log(err)
      console.log(data)
      if (!err) {
        const res = JSON.parse(data.toString())
        const result = !!(typeof res[flagname] !== "undefined" && res[flagname])
        console.log(result)
        return result
      }
    })
  }

  static setFlags(flags) {
    console.log(JSON.stringify(flags))
    writeFile("./features.json", JSON.stringify(flags), function (err) {})
  }
}

export default FeatureFlagStrategy
