import React from "react"
import { useAdminCreateBatchJob } from "medusa-react"

const CreateBatchJob = () => {
  const createBatchJob = useAdminCreateBatchJob()
  // ...

  const handleCreateBatchJob = () => {
    createBatchJob.mutate({
      type: "publish-products",
      context: {},
      dry_run: true
    }, {
      onSuccess: ({ batch_job }) => {
        console.log(batch_job)
      }
    })
  }

  // ...
}

export default CreateBatchJob
