// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import fs from 'fs';
import path from 'path';
import { ethers } from 'hardhat';

const NETWORK = process.env.HARDHAT_NETWORK;
const NETWORK_IDS = {
  localhost: 31337,
  mumbai: 80001,
  goerly: 5,
  matic: 137,
};

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const EventCreator = await ethers.getContractFactory('EventCreator');
  const eventCreator = await EventCreator.deploy();

  await eventCreator.deployed();

  console.log('EventCreator deployed to:', eventCreator.address);
  moveAbis(eventCreator.address);
}

function loadExistingNetworks() {
  try {
    const contract = require('../../events-ui/src/abis/Creator.json');

    return contract.networks;
  } catch (err) {
    return {};
  }
}

function moveAbis(contractAddress: string) {
  const contractAbi =
    require('../artifacts/contracts/EventCreator.sol/EventCreator.json').abi;
  const eventContractAbi = require('../artifacts/contracts/Event.sol/Event.json');
  const networks = loadExistingNetworks();
  // @ts-ignore
  const contractData = JSON.stringify({
    abi: contractAbi,
    networks: {
      ...networks,
      [NETWORK_IDS[NETWORK]]: { address: contractAddress },
    },
  });
  fs.writeFileSync(
    path.resolve(__dirname, '../../events-ui/src/abis/Creator.json'),
    contractData
  );
  fs.writeFileSync(
    path.resolve(__dirname, '../../events-ui/src/abis/Event.json'),
    JSON.stringify(eventContractAbi)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
