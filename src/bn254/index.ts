import { hashToField as poseidon2Hash } from "./hash"
import { hashToFieldAsync as poseidon2HashAsync } from "./hash-async"
import { getPoseidon2BN254 } from "./instance"

export const permute = (input: bigint[]) => getPoseidon2BN254().permute(input)
export const F = getPoseidon2BN254().primeField
export { poseidon2Hash, poseidon2HashAsync }
