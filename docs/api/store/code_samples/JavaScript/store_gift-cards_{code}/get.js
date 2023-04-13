import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.giftCards.retrieve(code)
.then(({ gift_card }) => {
  console.log(gift_card.id);
});
