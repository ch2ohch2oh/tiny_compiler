import { assert } from "console";

/**
 * Break down a string into list of tokens
 * Valid token types are: paren, number, stirng and name
 * @param {string} input string to be tokenized
 */
function tokenizer(input) {
  let current = 0;
  let tokens = [];

  while (current < input.length) {
    let char = input[current];
    if (char === "(") {
      tokens.push({ type: "paren", value: "(" });
      current++;
      continue;
    }
    if (char === ")") {
      tokens.push({ type: "paren", value: ")" });
      current++;
      continue;
    }

    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = "";
      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: "number", value });
      continue;
    }

    // String literals enclosed in double quotes
    if (char === '"') {
      let value = "";
      char = input[++current];
      while (char !== '"') {
        value += char;
        char = input[++current];
      }
      char = input[++current];
      tokens.push({ type: "string", value });
      continue;
    }

    // Identifier that only consists of letters
    let LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = "";
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: "name", value });
      continue;
    }
    throw new TypeError("Unknown char encountered: " + char);
  }
  return tokens;
}

/**
 * Convert the list of tokens into an AST
 * @param {*} tokens
 */
function parser(tokens) {
  let current = 0;

  // Walk through the token list and build an AST
  function walk() {
    let token = tokens[current];
    if (token.type === "number") {
      current++;
      return { type: "NumberLiteral", value: token.value };
    }
    if (token.type === "string") {
      current++;
      return { type: "StringLiteral", value: token.value };
    }
    if (token.type === "paren" && token.value === "(") {
      token = tokens[++current];
      // Cannot have empty parenthesis like ()
      assert(token.type === "name");
      let node = { type: "CallExpression", name: token.value, params: [] };
      // Skip the name token, i.e. function name
      token = tokens[++current];
      while (
        token.type !== "paren" ||
        (token.type === "paren" && token.value !== ")")
      ) {
        node.params.push(walk());
        token = tokens[current];
      }
      // Skip closing paren
      current++;
      return node;
    }
    throw new TypeError(
      "Unknown token: " + JSON.stringify(token) + " token position = " + current
    );
  }

  let ast = { type: "Program", body: [] };

  while (current < tokens.length) {
    ast.body.push(walk());
  }
  return ast;
}

export { tokenizer, parser };
