import { F1Field } from "../core/field"
import { Poseidon2 } from "../core/poseidon2"
import { getPoseidon2Params } from "../core/poseidon2params"
import { MAT_DIAG4_M_1, MAT_INTERNAL4, RC4 } from "./constants"

const bn254Field = new F1Field(
  BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617"),
)

let instance: Poseidon2 | null = null

export function getPoseidon2BN254(): Poseidon2 {
  if (!instance) {
    instance = new Poseidon2(
      getPoseidon2Params(4, 5, 8, 56, MAT_DIAG4_M_1, MAT_INTERNAL4, RC4),
      bn254Field,
    )
  }
  return instance
}
