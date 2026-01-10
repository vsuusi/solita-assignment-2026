import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest/presets/default-esm", // Use the ESM preset
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    // Force Jest to map .js imports to .ts files
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    // Encode 'ts-jest' settings here
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};

export default config;
