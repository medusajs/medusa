import { FormattingOptionsType } from "types"

const medusaOptions: FormattingOptionsType = {
  "^medusa/": {
    maxLevel: 2,
    parameterComponentExtraProps: {
      expandUrl:
        "https://docs.medusajs.com/development/entities/repositories#retrieving-a-list-of-records",
    },
  },
  "^medusa/classes/medusa\\.(Store*|Admin*)": {
    reflectionGroups: {
      Constructors: false,
    },
  },
}

export default medusaOptions
