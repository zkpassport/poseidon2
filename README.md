# @zkpassport/poseidon2

A blazing fast Poseidon2 implementation in TypeScript for the BN254 curve. This package provides both synchronous and asynchronous hash functions for efficient cryptographic operations.

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

The package provides both synchronous and asynchronous hash functions. The asynchronous version is recommended for better performance with large inputs, as it yields to the event loop during computation, whereas the synchronous version blocks execution.

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
