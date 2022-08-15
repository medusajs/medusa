import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.batchJobs.create({
  type: 'product-export',
  context: {},
  dry_run: false
}).then((({ batch_job }) => {
  console.log(batch_job.id);
});
