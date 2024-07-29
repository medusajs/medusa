import {
  defineJoinerConfig,
  MedusaService,
  model,
  Module,
} from "@medusajs/utils"

export const User = model.define("user", {
  id: model.id().primaryKey(),
  name: model.text(),
})

export const Car = model.define("car", {
  id: model.id().primaryKey(),
  name: model.text(),
})

export const userJoinerConfig = defineJoinerConfig("User", {
  models: [User],
})

export const carJoinerConfig = defineJoinerConfig("Car", {
  models: [Car],
})

export class UserService extends MedusaService({ User }) {
  constructor() {
    super(...arguments)
  }
}

export class CarService extends MedusaService({ Car }) {
  constructor() {
    super(...arguments)
  }
}

export const UserModule = Module("User", {
  service: UserService,
})

export const CarModule = Module("Car", {
  service: CarService,
})
