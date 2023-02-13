import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.notes.update(note_id, {
 value: 'We delivered this order'
})
.then(({ note }) => {
  console.log(note.id);
});
