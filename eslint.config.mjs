import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs"
    },
    rules: {
      semi: ["error", "always"],
      "no-unused-vars": [2, { "args": "after-used", "argsIgnorePattern": "^_" }],
      quotes: [2, "single", { "avoidEscape": true }]
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
  },
  pluginJs.configs.recommended,
];