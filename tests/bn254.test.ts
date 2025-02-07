import { permute, poseidon2Hash } from "../src/bn254"

describe("poseidon2 bn254", () => {
  it("permute", () => {
    const state = [
      BigInt("0x9a807b615c4d3e2fa0b1c2d3e4f56789fedcba9876543210abcdef0123456789"),
      BigInt("0x9a807b615c4d3e2fa0b1c2d3e4f56789fedcba9876543210abcdef0123456789"),
      BigInt("0x9a807b615c4d3e2fa0b1c2d3e4f56789fedcba9876543210abcdef0123456789"),
      BigInt("0x9a807b615c4d3e2fa0b1c2d3e4f56789fedcba9876543210abcdef0123456789"),
    ]
    const permuteResult = permute(state)
    expect(permuteResult).toEqual([
      BigInt("0x2bf1eaf87f7d27e8dc4056e9af975985bccc89077a21891d6c7b6ccce0631f95"),
      BigInt("0x0c01fa1b8d0748becafbe452c0cb0231c38224ea824554c9362518eebdd5701f"),
      BigInt("0x018555a8eb50cf07f64b019ebaf3af3c925c93e631f3ecd455db07bbb52bbdd3"),
      BigInt("0x0cbea457c91c22c6c31fd89afd2541efc2edf31736b9f721e823b2165c90fd41"),
    ])
  })
  it("permute [0,1,2,3] ", () => {
    const state = [BigInt(0), BigInt(1), BigInt(2), BigInt(3)]
    const permuteResult = permute(state)
    expect(permuteResult).toEqual([
      BigInt("0x01bd538c2ee014ed5141b29e9ae240bf8db3fe5b9a38629a9647cf8d76c01737"),
      BigInt("0x239b62e7db98aa3a2a8f6a0d2fa1709e7a35959aa6c7034814d9daa90cbac662"),
      BigInt("0x04cbb44c61d928ed06808456bf758cbf0c18d1e15a7b6dbc8245fa7515d5e3cb"),
      BigInt("0x2e11c5cff2a22c64d01304b778d78f6998eff1ab73163a35603f54794c30847a"),
    ])
  })
  it("hash to single field element", () => {
    const hash = poseidon2Hash([BigInt(0), BigInt(0)])
    expect(hash).toEqual(
      BigInt("0x0b63a53787021a4a962a452c2921b3663aff1ffd8d5510540f8e659e782956f1"),
    )
  })
})
