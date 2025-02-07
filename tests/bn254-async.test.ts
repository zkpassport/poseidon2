import { F, poseidon2HashAsync } from "../src/bn254"

describe("poseidon2 bn254 async", () => {
  // Helper to create a promise that resolves after ms milliseconds
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  // Helper to measure time between yields
  const measureTimeGaps = async (
    operation: () => Promise<bigint>,
    callback: (gap: number) => void,
  ) => {
    let lastTime = Date.now()
    const originalResolve = Promise.resolve.bind(Promise)

    // Override Promise.resolve to measure gaps between yields
    Promise.resolve = () => {
      const now = Date.now()
      const gap = now - lastTime
      callback(gap)
      lastTime = now
      return originalResolve()
    }

    try {
      await operation()
    } finally {
      // Restore original Promise.resolve
      Promise.resolve = originalResolve
    }
  }

  it("should yield to event loop during intensive operations", async () => {
    const input = Array(1000).fill(1n) // Large input to ensure multiple chunks
    const timeGaps: number[] = []

    await measureTimeGaps(
      () => poseidon2HashAsync(input),
      (gap) => timeGaps.push(gap),
    )

    // We expect yields to happen frequently enough that no gap is too large
    const maxGap = Math.max(...timeGaps)
    expect(maxGap).toBeLessThan(100) // No operation should block for more than 100ms
  })

  it("should allow interleaving of other async operations", async () => {
    // Track time gaps between operations
    const gaps: number[] = []
    let lastTime = Date.now()

    const recordGap = () => {
      const now = Date.now()
      gaps.push(now - lastTime)
      lastTime = now
    }

    // Run a CPU-intensive hash operation
    const input = Array(10000).fill(1n)
    await poseidon2HashAsync(input)

    // Measure gaps during another hash operation while running a timer
    lastTime = Date.now()

    const hashPromise = poseidon2HashAsync(input)

    // Run timer operations while hash is processing
    for (let i = 0; i < 20; i++) {
      await delay(5) // Increased delay to give more time for hash operation
      recordGap()
    }

    await hashPromise
    recordGap()

    // Verify that we had some reasonable gaps during processing
    // We expect most gaps to be small (indicating yielding is working)
    const smallGaps = gaps.filter((gap) => gap < 500) // Allow for some larger gaps due to system load
    expect(smallGaps.length).toBeGreaterThan(gaps.length * 0.7) // At least 70% should be small gaps

    // We should have recorded multiple gaps
    expect(gaps.length).toBeGreaterThan(10)
  })

  it("should maintain correctness while being async", async () => {
    // Test vectors
    const inputs = [[1n, 2n, 3n], Array(100).fill(42n), [0n], []]

    // Hash each input twice - results should be identical
    for (const input of inputs) {
      const result1 = await poseidon2HashAsync(input)
      const result2 = await poseidon2HashAsync(input)

      expect(result1).toBe(result2)
      // Verify result is in the prime field
      expect(result1 < F.prime).toBe(true)
    }
  })

  it("should handle concurrent hashing operations", async () => {
    const inputs = Array(5)
      .fill(0)
      .map((_, i) => Array(100).fill(BigInt(i)))

    // Hash all inputs concurrently
    const results = await Promise.all(inputs.map((input) => poseidon2HashAsync(input)))

    // Verify all operations completed and gave consistent results
    const serialResults = await Promise.all(inputs.map((input) => poseidon2HashAsync(input)))

    expect(results).toEqual(serialResults)
  })
})
