# @zkpassport/poseidon2

A fast Poseidon2 implementation in pure TypeScript for the BN254 curve.

## Installation

```bash
# Using bun
bun add @zkpassport/poseidon2

# Using npm
npm i @zkpassport/poseidon2

# Using yarn
yarn add @zkpassport/poseidon2
```

## Usage

This package provides both synchronous and asynchronous Poseidon2 hash functions. The asynchronous version is recommended for hashing many inputs, as it yields to the event loop during computation, whereas the synchronous version blocks execution.

### Synchronous Usage

```typescript
import { poseidon2Hash } from "@zkpassport/poseidon2"

// Hash an array of bigints
const input = [1n, 2n, 3n]
const hash = poseidon2Hash(input)
console.log(hash) // Returns a single bigint hash value
```

### Asynchronous Usage

```typescript
import { poseidon2HashAsync } from "@zkpassport/poseidon2"

// Hash an array of bigints asynchronously
const input = [1n, 2n, 3n]
const hash = await poseidon2HashAsync(input)
console.log(hash) // Returns a single bigint hash value
```

## Features

- Optimized implementation for BN254 curve
- Both synchronous and asynchronous hash functions
- TypeScript support with full type definitions
- Zero dependencies
- Efficient memory usage
- Suitable for both Node.js and browser environments

## Performance

Hashrate comparison between TypeScript and WASM implementations:

| Implementation       | Iterations | Time (sec) | Hashes/sec |
| -------------------- | ---------- | ---------- | ---------- |
| Poseidon2 TypeScript | 1,000,000  | ~140       | ~7,000     |
| Poseidon2 WASM       | 1,000,000  | ~30        | ~32,000    |
