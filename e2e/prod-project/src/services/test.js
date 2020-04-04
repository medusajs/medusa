import { BaseService } from "medusa-interfaces"

class TestService extends BaseService {
  constructor({ testModel }) {
    super()

    this.testModel_ = testModel
  }

  async sayHi() {
    const res = await this.testModel_.create({ title: "hi" })
    return res
  }
}

export default TestService
