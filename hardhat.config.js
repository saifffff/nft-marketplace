require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  // configured hardhat to put the smart contracts at a different location to be able to access the contracts from the client side interface of the application
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
};
