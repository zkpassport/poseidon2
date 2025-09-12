import fc from "fast-check"
import { BarretenbergSync, Fr } from "@aztec/bb.js"
import { F, poseidon2Hash, poseidon2HashAsync } from "../src/bn254"

describe("poseidon2 equivalence", () => {
  it("should return same result for sync and async variants", () => {
    fc.assert(
      fc.asyncProperty(fc.array(fc.bigInt(0n, F.prime - 1n)), async (input) => {
        const syncResult = poseidon2Hash(input)
        const asyncResult = await poseidon2HashAsync(input)
        return syncResult == asyncResult
      }),
    )
  })

  it("should return same result as bb.js", async () => {
    const bb = await BarretenbergSync.initSingleton()

    fc.assert(
      fc.property(fc.array(fc.bigInt(0n, F.prime - 1n)), (input) => {
        const result = poseidon2Hash(input)
        const bbInput = input.map((field) => new Fr(field))
        const bbResult = bb.poseidon2Hash(bbInput)
        return result == BigInt(bbResult.toString())
      }),
    )
  })
})
