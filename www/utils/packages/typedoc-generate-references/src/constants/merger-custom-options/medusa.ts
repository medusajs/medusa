import { FormattingOptionsType } from "types"

const medusaOptions: FormattingOptionsType = {
  "^medusa/": {
    maxLevel: 2,
  },
  "^medusa/classes/medusa\\.(Store*|Admin*)": {
    reflectionGroups: {
      Constructors: false,
    },
  },
}

export default medusaOptions
