/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-escape */
/* eslint-disable prefer-destructuring */
import Web3 from 'web3';
import CreatorContract from '../abis/Creator.json';
import EventContract from '../abis/Event.json';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const connectToMetamask = async (retry) => {
  const accounts = await window.web3Instance.eth.getAccounts();
  if (accounts.length === 0) {
    if (retry) return [false, ZERO_ADDRESS];
    await window.ethereum.enable();
    return connectToMetamask();
  }
  window.selectedAddress = accounts[0];
  return [true, accounts[0]];
};

export const loadContracts = async () => {
  const networkId = await window.web3Instance.eth.net.getId();
  const networkData = CreatorContract.networks[networkId];
  if (!networkData) return [];

  window.creatorContract = new window.web3Instance.eth.Contract(CreatorContract.abi, networkData.address);

  return [window.creatorContract];
};

export const loadEventContract = (eventAddress) => {
  window.eventContract = new window.web3Instance.eth.Contract(EventContract.abi, eventAddress);
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

export const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3Instance = new Web3(window.ethereum);
  } else {
    window.alert(
      'Metamask not installed',
    );
  }
};
