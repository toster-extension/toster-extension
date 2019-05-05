const path = require('path')

module.exports = {
    rootDir: path.resolve(__dirname),
    verbose: true,
    silent: true,
    bail: true,
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'js', 'json', 'vue'],
    moduleDirectories: ['node_modules'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^assets/(.*)': '<rootDir>/assets/$1'
    },
    setupFiles: ['<rootDir>/test/setup.js'],
    transform: {
        '.*\\.(png|jpe?g|gif|svg)$': '<rootDir>/test/fileTransformer.js',
        '.*\\.(s?css)$': '<rootDir>/node_modules/jest-css-modules',
        '.+\\.ts$': '<rootDir>/node_modules/ts-jest',
        '.*\\.vue$': '<rootDir>/node_modules/jest-vue-preprocessor'
    },
    testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|js)$'
}
