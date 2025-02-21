type IHashOut = [bigint, bigint, bigint]

import { getPoseidon2BN254 } from "./instance.js"

export const F = getPoseidon2BN254().primeField

export const permute = getPoseidon2BN254().permute.bind(getPoseidon2BN254())

enum Mode {
  ABSORB,
  SQUEEZE,
}

class FieldSponge {
  private state: bigint[]
  private cache: bigint[]
  private cacheSize: number
  private mode: Mode
  private readonly rate: number
  private readonly t: number

  constructor(domainIv = 0n) {
    this.rate = getPoseidon2BN254().getT() - 1
    this.t = getPoseidon2BN254().getT()

    this.state = new Array(this.t).fill(0n)
    this.state[this.rate] = domainIv

    this.cache = new Array(this.rate).fill(0n)
    this.cacheSize = 0
    this.mode = Mode.ABSORB
  }

  private performDuplex(): bigint[] {
    // Zero-pad the cache
    for (let i = this.cacheSize; i < this.rate; i++) {
      this.cache[i] = 0n
    }
    // Add cache into sponge state
    for (let i = 0; i < this.rate; i++) {
      this.state[i] = F.add(this.state[i], this.cache[i])
    }
    this.state = permute(this.state)

    // Return rate number of elements from state
    return this.state.slice(0, this.rate)
  }

  absorb(input: bigint): void {
    if (this.mode === Mode.ABSORB && this.cacheSize === this.rate) {
      this.performDuplex()
      this.cache[0] = input
      this.cacheSize = 1
    } else if (this.mode === Mode.ABSORB && this.cacheSize < this.rate) {
      this.cache[this.cacheSize] = input
      this.cacheSize += 1
    } else if (this.mode === Mode.SQUEEZE) {
      this.cache[0] = input
      this.cacheSize = 1
      this.mode = Mode.ABSORB
    }
  }

  squeeze(): bigint {
    if (this.mode === Mode.SQUEEZE && this.cacheSize === 0) {
      this.mode = Mode.ABSORB
      this.cacheSize = 0
    }
    if (this.mode === Mode.ABSORB) {
      const newOutputElements = this.performDuplex()
      this.mode = Mode.SQUEEZE
      for (let i = 0; i < this.rate; i++) {
        this.cache[i] = newOutputElements[i]
      }
      this.cacheSize = this.rate
    }

    const result = this.cache[0]
    for (let i = 1; i < this.cacheSize; i++) {
      this.cache[i - 1] = this.cache[i]
    }
    this.cacheSize -= 1
    this.cache[this.cacheSize] = 0n
    return result
  }

  static hashInternal(input: bigint[], outLen: number, isVariableLength: boolean): bigint[] {
    const iv = (BigInt(input.length) << BigInt(64n)) + BigInt(outLen - 1)
    const sponge = new FieldSponge(iv)

    for (let i = 0; i < input.length; i++) {
      sponge.absorb(input[i])
    }

    if (isVariableLength) {
      sponge.absorb(1n)
    }

    const output: bigint[] = []
    for (let i = 0; i < outLen; i++) {
      output.push(sponge.squeeze())
    }
    return output
  }

  static hashFixedLength(input: bigint[], outLen = 1): bigint[] {
    return this.hashInternal(input, outLen, false)
  }

  static hashVariableLength(input: bigint[], outLen = 1): bigint[] {
    return this.hashInternal(input, outLen, true)
  }
}

export function hashToField(input: bigint[]): bigint {
  return FieldSponge.hashFixedLength(input)[0]
}

export type { IHashOut }
