import { OrchestratorBuilder } from "../../transaction/orchestrator-builder"

describe("OrchestratorBuilder", () => {
  let builder: OrchestratorBuilder

  beforeEach(() => {
    builder = new OrchestratorBuilder()
  })

  it("should load a TransactionStepsDefinition", () => {
    builder.load({ action: "foo" })
    expect(builder.build()).toEqual({
      action: "foo",
    })
  })

  it("should add a new action after the last action set", () => {
    builder.addAction("foo")

    expect(builder.build()).toEqual({
      action: "foo",
    })

    builder.addAction("bar")

    expect(builder.build()).toEqual({
      action: "foo",
      next: {
        action: "bar",
      },
    })
  })

  it("should replace an action by another keeping its next steps", () => {
    builder.addAction("foo").addAction("axe").replaceAction("foo", "bar")
    expect(builder.build()).toEqual({
      action: "bar",
      next: {
        action: "axe",
      },
    })
  })

  it("should insert a new action before an existing action", () => {
    builder.addAction("foo").addAction("bar").insertActionBefore("bar", "axe")

    expect(builder.build()).toEqual({
      action: "foo",
      next: {
        action: "axe",
        next: {
          action: "bar",
        },
      },
    })
  })

  it("should insert a new action after an existing action", () => {
    builder.addAction("foo").addAction("axe").insertActionAfter("foo", "bar")

    expect(builder.build()).toEqual({
      action: "foo",
      next: {
        action: "bar",
        next: {
          action: "axe",
        },
      },
    })
  })

  it("should move an existing action and its next steps to another place. the destination will become next steps of the final branch", () => {
    builder
      .addAction("foo")
      .addAction("bar")
      .addAction("axe")
      .addAction("zzz")
      .moveAction("axe", "foo")

    expect(builder.build()).toEqual({
      action: "axe",
      next: {
        action: "zzz",
        next: {
          action: "foo",
          next: {
            action: "bar",
          },
        },
      },
    })
  })

  it("should merge two action to run in parallel", () => {
    builder
      .addAction("foo")
      .addAction("bar")
      .addAction("axe")
      .mergeActions("foo", "axe")

    expect(builder.build()).toEqual({
      next: [
        {
          action: "foo",
          next: { action: "bar" },
        },
        { action: "axe" },
      ],
    })
  })

  it("should merge multiple actions to run in parallel", () => {
    builder
      .addAction("foo")
      .addAction("bar")
      .addAction("axe")
      .addAction("step")
      .mergeActions("bar", "axe", "step")

    expect(builder.build()).toEqual({
      action: "foo",
      next: [
        {
          action: "bar",
        },
        {
          action: "axe",
        },
        {
          action: "step",
        },
      ],
    })
  })

  it("should delete an action", () => {
    builder.addAction("foo").deleteAction("foo")

    expect(builder.build()).toEqual({})
  })

  it("should delete an action and keep all the next steps of that branch", () => {
    builder
      .addAction("foo")
      .addAction("bar")
      .addAction("axe")
      .deleteAction("bar")

    expect(builder.build()).toEqual({
      action: "foo",
      next: {
        action: "axe",
      },
    })
  })

  it("should delete an action and remove all the next steps of that branch", () => {
    builder
      .addAction("foo")
      .addAction("bar")
      .addAction("axe")
      .addAction("step")
      .pruneAction("bar")
    expect(builder.build()).toEqual({
      action: "foo",
    })
  })

  it("should append a new action to the end of a given action's branch", () => {
    builder
      .load({
        action: "foo",
        next: [
          {
            action: "bar",
            next: {
              action: "zzz",
            },
          },
          {
            action: "axe",
          },
        ],
      })
      .appendAction("step", "bar", { saveResponse: true })

    expect(builder.build()).toEqual({
      action: "foo",
      next: [
        {
          action: "bar",
          next: {
            action: "zzz",
            next: {
              action: "step",
              saveResponse: true,
            },
          },
        },
        {
          action: "axe",
        },
      ],
    })
  })

  describe("Composing Complex Transactions", () => {
    const loadedFlow = {
      next: {
        action: "createProduct",
        saveResponse: true,
        next: {
          action: "attachToSalesChannel",
          saveResponse: true,
          next: {
            action: "createPrices",
            saveResponse: true,
            next: {
              action: "createInventoryItems",
              saveResponse: true,
              next: {
                action: "attachInventoryItems",
                noCompensation: true,
              },
            },
          },
        },
      },
    }

    it("should load a transaction and add two steps", () => {
      const builder = new OrchestratorBuilder(loadedFlow)
      builder
        .addAction("step_1", { saveResponse: true })
        .addAction("step_2", { saveResponse: true })

      expect(builder.build()).toEqual({
        action: "createProduct",
        saveResponse: true,
        next: {
          action: "attachToSalesChannel",
          saveResponse: true,
          next: {
            action: "createPrices",
            saveResponse: true,
            next: {
              action: "createInventoryItems",
              saveResponse: true,
              next: {
                action: "attachInventoryItems",
                noCompensation: true,
                next: {
                  action: "step_1",
                  saveResponse: true,
                  next: {
                    action: "step_2",
                    saveResponse: true,
                  },
                },
              },
            },
          },
        },
      })
    })

    it("should load a transaction, add 2 steps and merge step_1 to run in parallel with createProduct", () => {
      const builder = new OrchestratorBuilder(loadedFlow)
      builder
        .addAction("step_1", { saveResponse: true })
        .addAction("step_2", { saveResponse: true })
        .mergeActions("createProduct", "step_1")

      expect(builder.build()).toEqual({
        next: [
          {
            action: "createProduct",
            saveResponse: true,
            next: {
              action: "attachToSalesChannel",
              saveResponse: true,
              next: {
                action: "createPrices",
                saveResponse: true,
                next: {
                  action: "createInventoryItems",
                  saveResponse: true,
                  next: {
                    action: "attachInventoryItems",
                    noCompensation: true,
                  },
                },
              },
            },
          },
          {
            action: "step_1",
            saveResponse: true,
            next: {
              action: "step_2",
              saveResponse: true,
            },
          },
        ],
      })
    })

    it("should load a transaction, add 2 steps and move 'step_1' and all its next steps to run before 'createPrices'", () => {
      const builder = new OrchestratorBuilder(loadedFlow)
      builder
        .addAction("step_1", { saveResponse: true })
        .addAction("step_2", { saveResponse: true })
        .moveAction("step_1", "createPrices")

      expect(builder.build()).toEqual({
        action: "createProduct",
        saveResponse: true,
        next: {
          action: "attachToSalesChannel",
          saveResponse: true,
          next: {
            action: "step_1",
            saveResponse: true,
            next: {
              action: "step_2",
              saveResponse: true,
              next: {
                action: "createPrices",
                saveResponse: true,
                next: {
                  action: "createInventoryItems",
                  saveResponse: true,
                  next: {
                    action: "attachInventoryItems",
                    noCompensation: true,
                  },
                },
              },
            },
          },
        },
      })
    })

    it("should load a transaction, add 2 steps and move 'step_1' to run before 'createPrices' and merge next steps", () => {
      const builder = new OrchestratorBuilder(loadedFlow)
      builder
        .addAction("step_1", { saveResponse: true })
        .addAction("step_2", { saveResponse: true })
        .moveAndMergeNextAction("step_1", "createPrices")

      expect(builder.build()).toEqual({
        action: "createProduct",
        saveResponse: true,
        next: {
          action: "attachToSalesChannel",
          saveResponse: true,
          next: {
            action: "step_1",
            saveResponse: true,
            next: [
              {
                action: "step_2",
                saveResponse: true,
              },
              {
                action: "createPrices",
                saveResponse: true,
                next: {
                  action: "createInventoryItems",
                  saveResponse: true,
                  next: {
                    action: "attachInventoryItems",
                    noCompensation: true,
                  },
                },
              },
            ],
          },
        },
      })
    })

    it("Fully compose a complex transaction", () => {
      const builder = new OrchestratorBuilder()
      builder
        .addAction("step_1", { saveResponse: true })
        .addAction("step_2", { saveResponse: true })
        .addAction("step_3", { saveResponse: true })

      builder.insertActionBefore("step_3", "step_2.5", {
        saveResponse: false,
        noCompensation: true,
      })

      builder.insertActionAfter("step_1", "step_1.1", { saveResponse: true })

      builder.insertActionAfter("step_3", "step_4", { async: false })

      builder
        .mergeActions("step_2", "step_2.5", "step_3")
        .addAction("step_5", { noCompensation: true })

      builder.deleteAction("step_3")

      expect(builder.build()).toEqual({
        action: "step_1",
        saveResponse: true,
        next: {
          action: "step_1.1",
          saveResponse: true,
          next: [
            {
              action: "step_2",
              saveResponse: true,
            },
            {
              action: "step_2.5",
              saveResponse: false,
              noCompensation: true,
            },
            {
              action: "step_4",
              async: false,
              next: {
                action: "step_5",
                noCompensation: true,
              },
            },
          ],
        },
      })
    })
  })
})
