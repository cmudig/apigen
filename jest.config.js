/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node'
};

// module.exports = {
//   testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
//   moduleFileExtensions: ["js", "ts", "json"],
//   testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/", "<rootDir>/build/"],
//   coverageDirectory: "./coverage/",
//   collectCoverage: false,
//   testEnvironment: "node",
//   transform: {
//       ".*": "babel-jest",
//   },
// };
