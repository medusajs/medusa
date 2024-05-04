import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.batchJobs.cancel(batchJobId)
.then(({ batch_job }) => {
  console.log(batch_job.id);
})
