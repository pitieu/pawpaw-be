module.exports = {
  preset: '@shelf/jest-mongodb',
  collectCoverageFrom: ['../test/**/*.js'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/setup-test-framework-script.js'],
}
