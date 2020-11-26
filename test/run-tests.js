#!/bin/node

const execa = require('execa');
const fg = require('fast-glob');
const { Listr } = require('listr2');
const { getBinPathSync } = require('get-bin-path');

const binPath = getBinPathSync();
const testFiles = fg.sync('*.test.js', { cwd: __dirname });
const tasks = new Listr(
  testFiles.map(testFile => ({
    title: testFile,
    task: async (ctx, task) => {
      const subprocess = execa.node(testFile, {
        all: true, // interleaves stdout and stderr
        cwd: __dirname,
        env: { BIN_PATH: binPath },
      });
      subprocess.all.pipe(task.stdout());
      await subprocess;
    }
  })),
  {
    exitOnError: true,
    rendererOptions: {
      collapseErrors: false,
    }
  }
);

tasks.run().catch(e => {
  //console.error(e);
  process.exitCode = 1;
});
