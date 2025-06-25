import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/**/*.ts", "!src/**/*.test.ts"],
  format: ["cjs"],
  outDir: "dist/cjs",
  outExtension: () => ({ js: ".cjs" }),
  clean: true,
  dts: false,
})
