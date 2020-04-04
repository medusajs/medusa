import { BaseService } from "medusa-interfaces"

class TestService extends BaseService {
  constructor({ testModel }) {
    super()

    this.testModel_ = testModel
  }

  async sayHi() {
    console.log("hi service")
    const res = await this.testModel_.create({ title: "hi" })
    console.log("hi res")
    return res
  }
}

export default TestService
