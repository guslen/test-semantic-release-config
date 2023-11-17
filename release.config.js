/* eslint-disable @typescript-eslint/no-var-requires */
const packageJson = require('./package.json');
const fs = require('fs');
const path = require('path');

function getPackageName() {
  console.log('list files in current directory');
  fs.readdirSync(__dirname).forEach((file) => {
    console.log(file);
  });
  const { name, version } = packageJson;
  const transformedName = name.replace('@', '').replace('/', '-');
  const packageName = `${transformedName}-${version}.tgz`;
  console.log({ packageName });
  const resolvedPackageName = path.resolve(__dirname, packageName);
  console.log({ resolvedPackageName });
  return '*.tgz';
}

module.exports = {
  branches: ['main'],
  tagFormat: 'v${version}',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: getPackageName(),
            label: 'Package',
          },
        ],
      },
    ],
  ],
};
