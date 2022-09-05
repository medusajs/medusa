import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.giftCards.retrieve(gift_card_id)
.then(({ gift_card }) => {
  console.log(gift_card.id);
});
