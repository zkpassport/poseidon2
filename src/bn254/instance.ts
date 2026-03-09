import { F1Field } from "../core/field.js"
import { Poseidon2 } from "../core/poseidon2.js"
import { getPoseidon2Params } from "../core/poseidon2params.js"
import { MAT_DIAG4_M_1, MAT_DIAG16_M_1, MAT_INTERNAL4, RC3, RC4, RC16 } from "./constants.js"

const bn254Field = new F1Field(
  BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617"),
)

let instance: Poseidon2 | null = null
let instanceT3: Poseidon2 | null = null
let instanceT16: Poseidon2 | null = null

export function getPoseidon2BN254(): Poseidon2 {
  if (!instance) {
    instance = new Poseidon2(
      getPoseidon2Params(4, 5, 8, 56, MAT_DIAG4_M_1, MAT_INTERNAL4, RC4),
      bn254Field,
    )
  }
  return instance
}

export function getPoseidon2BN254T3(): Poseidon2 {
  if (!instanceT3) {
    // For t=3, matmulInternal uses a hardcoded formula, so diag is unused
    instanceT3 = new Poseidon2(
      getPoseidon2Params(3, 5, 8, 56, [0n, 0n, 0n], [[0n, 0n, 0n]], RC3),
      bn254Field,
    )
  }
  return instanceT3
}

export function getPoseidon2BN254T16(): Poseidon2 {
  if (!instanceT16) {
    instanceT16 = new Poseidon2(
      getPoseidon2Params(16, 5, 8, 57, MAT_DIAG16_M_1, [MAT_DIAG16_M_1], RC16),
      bn254Field,
    )
  }
  return instanceT16
}
