import test from 'ava';
import { execaNode } from 'execa';
import { stripIndent } from 'common-tags';
import { getBinPathSync } from 'get-bin-path';

const binPath = getBinPathSync();

test('can run the "help" command', async t => {
  const expected = stripIndent`
    Usage: <REDACTED>/build.js <operation> <optional arguments>
    <operation> can be \`version\`, \`dist\` or \`help\`.
    Operation \`version\` takes a semver increment type: --major, --premajor, --minor, --preminor, --patch, --prepatch, --prerelease. See https://github.com/npm/node-semver#functions for more information.
    Operation \`dist\` takes an optional \`--force\` argument to allow overwriting the output files.
  `;

  // First try to run the binary without any argument.
  let result;
  try {
    const { all } = await execaNode(binPath, { all: true });
    t.fail('Running the script without an argument should return a non-zero exit code.');
  } catch(e) {
    result = e.all;
  }
  t.is(result.trim().replace(/\/.*\/build\.js/, '<REDACTED>/build.js'), expected.trim());

  // Then run it with the "help" subcommand
  const { all } = await execaNode(binPath, ['help'], { all: true });
  result = all;
  t.is(result.trim().replace(/\/.*\/build\.js/, '<REDACTED>/build.js'), expected.trim());
});
