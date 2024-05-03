import { FormattingOptionsType } from "types"

const taxProviderOptions: FormattingOptionsType = {
  "^tax_provider/.*ITaxProvider": {
    reflectionGroups: {
      Properties: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create a tax provider to use with the Tax Module, and the methods to implement.`,
    frontmatterData: {
      slug: "/references/tax/provider",
    },
    reflectionTitle: {
      fullReplacement: "How to Create a Tax Provider",
    },
  },
}

export default taxProviderOptions
