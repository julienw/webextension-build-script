#!/bin/node

const execa = require('execa');
const assert = require('assert');

const expected = `
Usage: /home/julien/travail/git/webextension-build-script/bin/build.js <operation> <optional arguments>
<operation> can be \`version\`, \`dist\` or \`help\`.
Operation \`version\` takes a semver increment type: --major, --premajor, --minor, --preminor, --patch, --prepatch, --prerelease. See https://github.com/npm/node-semver#functions for more information.
Operation \`dist\` takes an optional \`--force\` argument to allow overwriting the output files.
`;

async function test() {
  // First try to run the binary without any argument.
  let result;
  try {
    const { all } = await execa.node(process.env.BIN_PATH, { all: true });
    assert.fail('Running the script without an argument should return a non-zero exit code.');
  } catch(e) {
    result = e.all;
  }
  assert.equal(result.trim(), expected.trim());

  const { all } = await execa.node(process.env.BIN_PATH, ['help'], { all: true });
  result = all;
  assert.equal(result.trim(), expected.trim());
}

test().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
