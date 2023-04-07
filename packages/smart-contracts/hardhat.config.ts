import * as dotenv from 'dotenv';
import '@matterlabs/hardhat-zksync-deploy';
import '@matterlabs/hardhat-zksync-solc';
import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  zksolc: {
    version: '1.3.8',
    compilerSource: 'binary',
    settings: {},
  },
  networks: {
    matic: {
      url: process.env.MATIC_URL || '',
      chainId: 137,
      from: process.env.MATIC_ACC_ADDRESS,
      accounts: process.env.MATIC_ACC_PRIV_KEY
        ? [process.env.MATIC_ACC_PRIV_KEY]
        : [],
    },
    mumbai: {
      url: process.env.MUMBAI_URL || '',
      chainId: 80001,
      from: process.env.MUMBAI_ACC_ADDRESS,
      accounts: process.env.MUMBAI_ACC_PRIV_KEY
        ? [process.env.MUMBAI_ACC_PRIV_KEY]
        : [],
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    zkTestnet: {
      url: 'https://testnet.era.zksync.dev', // URL of the zkSync network RPC
      ethNetwork: 'goerli', // Can also be the RPC URL of the Ethereum network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
    },
    zkMainnet: {
      url: 'https://mainnet.era.zksync.io', // URL of the zkSync network RPC
      ethNetwork: 'https://mainnet.infura.io/v3',
      zksync: true,
    },
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
