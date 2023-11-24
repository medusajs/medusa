createWorkflow<WorkflowInput, WorkflowOutput>(
  "hello-world",
  function (input) {
    const str1 = step1({})
    const str2 = step2(input)
    const str3 = step3(input)
    const str4 = step4(input)

    const result = transform(
      {
        str1,
        str2,
      },
      (input) => ({
        message: `${input.str1}\n${input.str2}`,
      })
    )

    return result
  }
)