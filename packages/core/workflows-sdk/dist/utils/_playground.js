"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const composer_1 = require("./composer");
const step1 = (0, composer_1.createStep)("step1", async (input, context) => {
    return new composer_1.StepResponse({ step1: "step1" });
});
const step2 = (0, composer_1.createStep)("step2", async (input, context) => {
    return new composer_1.StepResponse({ step2: input });
});
const step3 = (0, composer_1.createStep)("step3", async () => {
    return new composer_1.StepResponse({ step3: "step3" });
});
const workflow = (0, composer_1.createWorkflow)("sub-workflow", function (input) {
    step1();
    step3();
    return step2({ filters: { id: input.outsideWorkflowData } });
});
const workflow2 = (0, composer_1.createWorkflow)("workflow", function () {
    const step1Res = step1();
    step3();
    const workflowRes = workflow.asStep({ outsideWorkflowData: step1Res.step1 });
    return workflowRes;
});
workflow2()
    .run({})
    .then((res) => {
    console.log(res.result);
});
/*const step1 = createStep("step1", async (input: {}, context) => {
  return new StepResponse({ step1: ["step1"] })
})

const step2 = createStep("step2", async (input: string[], context) => {
  return new StepResponse({ step2: input })
})

const step3 = createStep("step3", async () => {
  return new StepResponse({ step3: "step3" })
})

const workflow = createWorkflow("workflow", function () {
  const step1Res = step1()
  step3()
  return step2(step1Res.step1)
})

workflow()
  .run({})
  .then((res) => {
    console.log(res.result)
  })*/
//# sourceMappingURL=_playground.js.map