import e from "cors"
import { TransactionBuilder } from "../../transaction/transaction-builder"

describe("TransactionBuilder", () => {
  describe("Basic methods", () => {
    let transactionBuilder: TransactionBuilder

    beforeEach(() => {
      transactionBuilder = new TransactionBuilder()
    })

    test("load", () => {
      transactionBuilder.load({ action: "foo" })
      expect(transactionBuilder.build()).toEqual({
        action: "foo",
      })
    })

    test("addAction", () => {
      transactionBuilder.addAction("foo", {})

      expect(transactionBuilder.build()).toEqual({
        action: "foo",
      })

      transactionBuilder.addAction("bar", {})

      expect(transactionBuilder.build()).toEqual({
        action: "foo",
        next: {
          action: "bar",
        },
      })
    })

    test("replaceAction", () => {
      transactionBuilder.addAction("foo", {}).replaceAction("foo", "bar", {})
      expect(transactionBuilder.build()).toEqual({
        action: "bar",
      })
    })

    test("insertActionBefore", () => {
      transactionBuilder
        .addAction("foo", {})
        .addAction("bar", {})
        .insertActionBefore("bar", "axe", {})

      expect(transactionBuilder.build()).toEqual({
        action: "foo",
        next: {
          action: "axe",
          next: {
            action: "bar",
          },
        },
      })
    })

    test("insertActionAfter", () => {
      transactionBuilder
        .addAction("foo", {})
        .addAction("axe", {})
        .insertActionAfter("foo", "bar", {})

      expect(transactionBuilder.build()).toEqual({
        action: "foo",
        next: {
          action: "bar",
          next: {
            action: "axe",
          },
        },
      })
    })

    test("moveAction", () => {
      transactionBuilder
        .addAction("foo", {})
        .addAction("bar", {})
        .addAction("axe", {})
        .moveAction("axe", "foo")

      expect(transactionBuilder.build()).toEqual({
        action: "axe",
        next: {
          action: "foo",
          next: {
            action: "bar",
          },
        },
      })
    })

    test("mergeActions - single", () => {
      transactionBuilder
        .addAction("foo", {})
        .addAction("bar", {})
        .addAction("axe", {})
        .mergeActions("foo", "axe")

      expect(transactionBuilder.build()).toEqual({
        next: [
          {
            action: "foo",
            next: { action: "bar" },
          },
          { action: "axe" },
        ],
      })
    })

    test("mergeActions - multiple", () => {
      transactionBuilder
        .addAction("foo", {})
        .addAction("bar", {})
        .addAction("axe", {})
        .addAction("step", {})
        .mergeActions("bar", "axe", "step")

      expect(transactionBuilder.build()).toEqual({
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

    test("deleteAction", () => {
      transactionBuilder.addAction("foo", {}).deleteAction("foo")

      expect(transactionBuilder.build()).toEqual({})
    })

    test("deleteAction - nested", () => {
      transactionBuilder
        .addAction("foo", {})
        .addAction("bar", {})
        .addAction("axe", {})
        .deleteAction("bar")

      expect(transactionBuilder.build()).toEqual({
        action: "foo",
        next: {
          action: "axe",
        },
      })
    })

    test("pruneAction", () => {
      transactionBuilder
        .addAction("foo", {})
        .addAction("bar", {})
        .addAction("axe", {})
        .addAction("step", {})
        .pruneAction("bar")
      expect(transactionBuilder.build()).toEqual({
        action: "foo",
      })
    })

    test("build", () => {
      transactionBuilder.addAction("foo", {})
      expect(transactionBuilder.build()).toEqual({
        action: "foo",
      })
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
      const builder = new TransactionBuilder(loadedFlow)
      builder
        .addAction("step_1", {}, { saveResponse: true })
        .addAction("step_2", {}, { saveResponse: true })

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

    it("should load a transaction, add 2 steps and move step_1 to run in parallel with createProduct", () => {
      const builder = new TransactionBuilder(loadedFlow)
      builder
        .addAction("step_1", {}, { saveResponse: true })
        .addAction("step_2", {}, { saveResponse: true })
        .moveAction("step_1", "createProduct", true)

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

    it("should load a transaction, add 2 steps and move step_1 to run in before createPrices", () => {
      const builder = new TransactionBuilder(loadedFlow)
      builder
        .addAction("step_1", {}, { saveResponse: true })
        .addAction("step_2", {}, { saveResponse: true })
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
      const builder = new TransactionBuilder()
      builder
        .addAction("step_1", {}, { saveResponse: true })
        .addAction("step_2", {}, { saveResponse: true })
        .addAction("step_3", {}, { saveResponse: true })

      builder.insertActionBefore(
        "step_3",
        "step_2.5",
        {},
        { saveResponse: false, noCompensation: true }
      )

      builder.insertActionAfter(
        "step_1",
        "step_1.1",
        {},
        { saveResponse: true }
      )

      builder.insertActionAfter("step_3", "step_4", {}, { async: false })

      builder
        .mergeActions("step_2", "step_2.5", "step_3")
        .addAction("step_5", {}, { noCompensation: true })

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
