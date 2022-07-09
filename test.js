import { tokenizer } from "./compiler.js";
import assert from "assert";

const input = "(add 2 (subtract 4 2))";
const output = "add(2, subtract(4, 2));";

const tokens = [
  { type: "paren", value: "(" },
  { type: "name", value: "add" },
  { type: "number", value: "2" },
  { type: "paren", value: "(" },
  { type: "name", value: "subtract" },
  { type: "number", value: "4" },
  { type: "number", value: "2" },
  { type: "paren", value: ")" },
  { type: "paren", value: ")" },
];

assert.deepStrictEqual(
  tokenizer(input),
  tokens,
  "Tokenizer should turn `input` string into `tokens` array"
);
console.log("All Passed!");
