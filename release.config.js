// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('./package.json');
function getPackageName() {
  const { name, version } = packageJson;
  const transformedName = name.replace('@', '').replace('/', '-');
  return `${transformedName}-${version}.tgz`;
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
