module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/models", "<rootDir>/routes"],
  modulePaths: ["<rootDir>"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};
