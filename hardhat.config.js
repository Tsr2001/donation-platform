require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      chainId: 31337,  // Hardhat Network with default chainId
    },
    ganache: {
      url: "http://127.0.0.1:8545",  // Ganache default RPC server
      chainId: 1337,  // Ganache also defaults to chainId 1337
    },
  },
};
