import { Identifier, MockManager, MockRepository } from "@babel/types";
import { describe, fail } from "yargs";
import GiftCardService from "../gift-card"

describe("GiftCardService", () => {
  
    const eventBusService = {
        emit: jest.fn(),
        withTransaction: function(){
            return this
        },
    }

    describe("list", async () => {  
      fail("create list tests")  
    })

    describe("create", async () => {
        fail("create create tests")
    })

    describe("retrieve", async () => {
        fail("create retrieve tests")
    })

    describe("retrieveByCode", async () => {
        fail("create retrieveByCode tests")
    })

    describe("update", async () => {
        fail("create update tests")
    })

    describe("delete", async () => {
        fail("create delete tests")
    })


    
})