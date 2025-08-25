import js from "@eslint/js";
import ts from "typescript-eslint";

export default [
  { ignores: ["dist", "src/routeTree.gen.ts"] },
  js.configs.recommended,
  ...ts.configs.recommended,
  { files: ["**/*.{ts,tsx}"] },
];
