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

export const AVAILABLE_NETWORKS = [
  ...(isProduction ? [] : [{ label: 'Localhost', value: '31337' }]),
  { label: 'Polygon', value: '137' },
  { label: 'Mumbai', value: '80001' },
];

const CURRENCY_LIST = {
  1: 'ETH',
  31337: 'ETH',
  80001: 'MATIC',
  137: 'MATIC',
}

export const RPC_LIST = {
  31337: 'http://127.0.0.1:8545/',
  80001:
    'https://polygon-mumbai.g.alchemy.com/v2/h6Egv6VKYsaWPleDnM8sBBC5xO_Tl6EI',
  137: 'https://polygon-rpc.com/',
};

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
  window.currency = CURRENCY_LIST[networkId];

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

export const changeNetwork = (chainId) => {
  if (!RPC_LIST[chainId]) return;

  localStorage.setItem('CHAIN_ID', chainId.toString());

  return window.location.reload();
};

export const getSelectedNetwork = () => localStorage.getItem('CHAIN_ID');

export const getDefaultProvider = () => {
  const selectedChainId = localStorage.getItem('CHAIN_ID');

  if (!selectedChainId) {
    localStorage.setItem('CHAIN_ID', DEFAULT_CHAIN_ID);
    return getDefaultProvider();
  }

  const rpcUrl = RPC_LIST[selectedChainId];

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

export const hashSha256 = async (str) => {
  const utf8 = new TextEncoder().encode(str);
  return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
  });
};
