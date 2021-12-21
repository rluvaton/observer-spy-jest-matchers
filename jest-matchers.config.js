module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: ['custom-matchers'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  // This is required as we test and generate our snapshots in Windows
  // we need to convert ansi (escape codes) from the output for it to work in linux too
  snapshotSerializers: ['jest-snapshot-serializer-ansi'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  setupFilesAfterEnv: [
    'jest-extended',
    './node_modules/@hirez_io/observer-spy/dist/setup-auto-unsubscribe.js'
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  clearMocks: true,
};
