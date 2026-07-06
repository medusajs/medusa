import Medusa from "@medusajs/js-sdk";

export const sdk = new Medusa({
  baseUrl: "/",
  auth: {
    type: "session",
  },
});
