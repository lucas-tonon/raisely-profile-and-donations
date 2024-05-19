import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs"
    },
    rules: {
      "no-unused-vars": [2, { "args": "after-used", "argsIgnorePattern": "^_" }],
      semi: ["error", "always"]
    }
  },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
];