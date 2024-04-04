import { FormattingOptionsType } from "types"

const paymentProviderOptions: FormattingOptionsType = {
  "^payment_provider": {
    frontmatterData: {
      displayed_sidebar: "experimentalSidebar",
    },
    maxLevel: 2,
  },
  "^payment_provider/.*AbstractPaymentProvider": {
    reflectionDescription: `In this document, you’ll learn how to create a Payment Provider to be used with the Payment Module.`,
    frontmatterData: {
      displayed_sidebar: "experimentalSidebar",
      slug: "/references/payment/provider",
    },
    reflectionTitle: {
      fullReplacement: "How to Create a Payment Provider",
    },
    reflectionGroups: {
      Properties: false,
    },
  },
}

export default paymentProviderOptions
