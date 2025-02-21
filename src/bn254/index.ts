import { hashToField as poseidon2Hash } from "./hash.js"
import { hashToFieldAsync as poseidon2HashAsync } from "./hash-async.js"
import { getPoseidon2BN254 } from "./instance.js"

export const permute = (input: bigint[]) => getPoseidon2BN254().permute(input)
export const F = getPoseidon2BN254().primeField
export { poseidon2Hash, poseidon2HashAsync }
