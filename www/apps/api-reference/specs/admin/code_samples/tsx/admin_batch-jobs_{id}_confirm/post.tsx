import React from "react"
import { useAdminConfirmBatchJob } from "medusa-react"

type Props = {
  batchJobId: string
}

const BatchJob = ({ batchJobId }: Props) => {
  const confirmBatchJob = useAdminConfirmBatchJob(batchJobId)
  // ...

  const handleConfirm = () => {
    confirmBatchJob.mutate(undefined, {
      onSuccess: ({ batch_job }) => {
        console.log(batch_job)
      }
    })
  }

  // ...
}

export default BatchJob
