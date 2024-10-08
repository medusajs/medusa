/**
 * cleanup temporary created resources for the migrations
 * @internal I didnt find a god place to put that, should we eventually add a close function
 * to the planner to handle that part? so that you would do planner.close() and it will handle the cleanup
 * automatically just like we usually do for the classic migrations actions
 */
export async function clearInstances() {
  const { MedusaModule } = require("@medusajs/framework/modules-sdk")
  MedusaModule.clearInstances()
}
