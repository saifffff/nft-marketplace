require("@nomiclabs/hardhat-waffle");

//https://sepolia.infura.io/v3/4d795100b1804605b452053dab0e97a6

const INFURA_API_KEY = `4d795100b1804605b452053dab0e97a6`;
const SEPOLIA_PRIVATE_KEY = "9437a9806d8b34a9fa32dbdc01d4a746e4fc61e0a3765a3d2bdafe381425bac3";
module.exports = {
  solidity: "0.8.4",
  networks:{
    sepolia:{
        url: "https://sepolia.infura.io/v3/"+INFURA_API_KEY,
        accounts:[SEPOLIA_PRIVATE_KEY]
      
    }
  },
  // configured hardhat to put the smart contracts at a different location to be able to access the contracts from the client side interface of the application
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
};
