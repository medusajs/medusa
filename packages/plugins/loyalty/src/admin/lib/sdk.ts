import Medusa from "@zjedene-medusa/js-sdk";

export const sdk = new Medusa({
  baseUrl: "/",
  auth: {
    type: "session",
  },
});
