/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-escape */
/* eslint-disable prefer-destructuring */
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import CreatorContract from '../abis/Creator.json';
import EventContract from '../abis/Event.json';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const DEFAULT_CHAIN_ID = 137;
export const CONNECTORS = {
  METAMASK: 'metamask',
  WALLET_CONNECT: 'wallet_connect',
};
const isProduction = window.location.host === 'crevents.xyz';

const HARDHAT_NETWORK = {
  chainId: '0x7a69',
  chainName: 'Hardhat',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['http://localhost:8545'],
};
export const AVAILABLE_NETWORKS = {
  ...(isProduction ? {} : { 31337: HARDHAT_NETWORK }),
  137: {
    chainId: '0x89',
    chainName: 'Matic(Polygon) Mainnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://www.polygonscan.com/'],
    gasTracker: 'https://gasstation-mainnet.matic.network/v2',
  },
  80001: {
    chainId: '0x13881',
    chainName: 'Matic(Polygon) Mumbai Testnet',
    nativeCurrency: { name: 'tMATIC', symbol: 'tMATIC', decimals: 18 },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    gasTracker: 'https://gasstation-mumbai.matic.today/v2',
  },
};
const RPC_LIST = Object.entries(AVAILABLE_NETWORKS).reduce((acc, el) => {
  acc[el[0]] = el[1].rpcUrls[0];
  return acc;
}, {});

export const connectWallet = async (connector, retry) => {
  await loadWeb3(connector);
  const accounts = await window.web3Instance.eth.getAccounts();
  if (accounts.length === 0) {
    if (retry) return [false, ZERO_ADDRESS];
    await window.ethereum.enable();
    return connectWallet(connector, true);
  }
  window.selectedAddress = accounts[0];
  return [true, accounts[0]];
};

export const checkProviderConnection = async () => {
  const accounts = await window.web3Instance.eth.getAccounts();
  if (accounts.length === 0) {
    return [false, null];
  }
  window.selectedAddress = accounts[0];
  return [window.isInjectedProvider, accounts[0]];
};

export const loadContracts = async () => {
  const networkId = await window.web3Instance.eth.net.getId();
  const networkData = CreatorContract.networks[networkId];
  if (!networkData) return [];

  window.creatorContract = new window.web3Instance.eth.Contract(
    CreatorContract.abi,
    networkData.address
  );
  window.currency = AVAILABLE_NETWORKS[networkId].nativeCurrency.symbol;

  return [window.creatorContract];
};

export const loadEventContract = (eventAddress) => {
  window.eventContract = new window.web3Instance.eth.Contract(
    EventContract.abi,
    eventAddress
  );
  return window.eventContract;
};

export function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export const getReferrer = () => getParameterByName('ref') || ZERO_ADDRESS;

export const changeNetwork = async (chainId) => {
  if (!AVAILABLE_NETWORKS[chainId]) return;

  if (!window.isInjectedProvider) {
    localStorage.setItem('CHAIN_ID', chainId.toString());
    return window.location.reload();
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: AVAILABLE_NETWORKS[chainId].chainId }],
    });
  } catch (err) {
    const networkParam = { ...AVAILABLE_NETWORKS[chainId] };
    delete networkParam.gasTracker;
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkParam],
    });
  } finally {
    window.location.reload();
  }
};

export const getSelectedNetwork = async () => {
  if (window.isInjectedProvider) return window.web3Instance.eth.net.getId();
  return localStorage.getItem('CHAIN_ID');
};

export const getDefaultProvider = () => {
  const selectedChainId = localStorage.getItem('CHAIN_ID');

  if (!selectedChainId) {
    localStorage.setItem('CHAIN_ID', DEFAULT_CHAIN_ID);
    return getDefaultProvider();
  }

  const rpcUrl = AVAILABLE_NETWORKS[selectedChainId]?.rpcUrls[0];

  if (!rpcUrl) {
    localStorage.removeItem('CHAIN_ID');
    return getDefaultProvider();
  }

  return new Web3.providers.HttpProvider(rpcUrl);
};

const isWalletConnectActive = () => {
  try {
    return JSON.parse(localStorage.getItem('walletconnect')).connected;
  } catch (err) {
    return false;
  }
};
export const loadWeb3 = async (connector) => {
  if (!connector && isWalletConnectActive()) {
    return loadWeb3(CONNECTORS.WALLET_CONNECT);
  }

  if (connector === CONNECTORS.WALLET_CONNECT) {
    window.ethereum = new WalletConnectProvider({
      rpc: RPC_LIST,
    });
    await window.ethereum.enable();
  }
  const provider = window.ethereum || getDefaultProvider();

  if (!provider) {
    return window.alert('No web3 provider found');
  }
  window.isInjectedProvider = provider === window.ethereum;
  window.web3Instance = new Web3(provider);
};

export const getGasPrice = async () => {
  let maxFeePerGas = window.web3Instance.utils.BN(40000000000); // fallback to 40 gwei
  let maxPriorityFeePerGas = window.web3Instance.utils.BN(40000000000); // fallback to 40 gwei
  try {
    const networkId = await window.web3Instance.eth.net.getId();
    const gasTrackerUrl = AVAILABLE_NETWORKS[networkId]?.gasTracker;
    if (!gasTrackerUrl) return {};

    const response = await fetch(gasTrackerUrl);
    const data = await response.json();

    maxFeePerGas = window.web3Instance.utils.toWei(
      Math.ceil(data.fast.maxFee).toString(),
      'gwei'
    );
    maxPriorityFeePerGas = window.web3Instance.utils.toWei(
      Math.ceil(data.fast.maxPriorityFee).toString(),
      'gwei'
    );
    return { maxFeePerGas, maxPriorityFeePerGas };
  } catch (err) {
    console.error(err);
    return {};
  }
};
