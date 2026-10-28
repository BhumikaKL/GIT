const test = require("node:test");
const assert = require("node:assert/strict");

test("Node.js runtime is available for the backend", () => {
  assert.equal(typeof process.version, "string");
  assert.match(process.version, /^v\d+/);
});
