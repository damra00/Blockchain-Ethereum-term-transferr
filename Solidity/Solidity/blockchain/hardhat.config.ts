import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const mnemonic = "view recipe black oxygen glimpse mushroom young elephant sample burden rich roast";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    }
  },
};

export default config;