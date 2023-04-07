import { Wallet } from 'zksync-web3';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';

const PRIVATE_KEYS = {
  280: process.env.ZKSYNC_ERA_TESTNET_ACC_PRIV_KEY,
  324: process.env.ZKSYNC_ERA_ACC_PRIV_KEY,
};
const NETWORK = process.env.HARDHAT_NETWORK || 'zkTestnet';
const NETWORK_IDS = {
  zkTestnet: 280,
  zkMainnet: 324,
};
const PRIVATE_KEY = PRIVATE_KEYS[NETWORK_IDS[NETWORK]];
// An example of a deploy script that will deploy and call a simple contract.
export default async function(hre: HardhatRuntimeEnvironment) {
  // Initialize the wallet.
  console.log('Deploying contract on zksync');
  const wallet = new Wallet(PRIVATE_KEY);

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact('EventCreator');

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  const gasEstimation = await deployer.estimateDeployFee(artifact, []);
  console.log('gas estimation is', gasEstimation.toString());
  // const eventCreatorContract = await deployer.deploy(artifact);
  //
  // // Show the contract info.
  // const contractAddress = eventCreatorContract.address;
  // console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}
