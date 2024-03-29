/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from 'react';
import {
  loadWeb3,
  loadContracts,
  connectWallet,
  checkProviderConnection,
} from '../utils/helpers';
import { useDispatch } from 'react-redux';
import { setEventContract } from '../store/eventContractSlice';
import { setCreatorContract } from '../store/creatorContractSlice';

function useInitializeApp() {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [networkNotSupported, setNetworkNotSupported] = useState(false);

  const initializeApp = useCallback(async () => {
    setLoading(true);
    try {
      if (!window.web3Instance) await loadWeb3();
      const [status] = await checkProviderConnection();
      setWalletConnected(status);
      const [creatorContract, eventContract] = await loadContracts();
      if (!creatorContract) {
        localStorage.removeItem('CHAIN_ID');
        localStorage.removeItem('walletconnect');
        setNetworkNotSupported(true);
        setLoading(false);
        return;
      }
      setNetworkNotSupported(false);
      dispatch(setEventContract(eventContract));
      dispatch(setCreatorContract(creatorContract));
    } catch (error) {
      console.log('initializeApp: error', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const handleWalletConnect = useCallback(
    async (connector, callback) => {
      const [status, _address] = await connectWallet(connector);
      setWalletConnected(status);
      if (status) {
        initializeApp();
      }
      callback(status);
    },
    [initializeApp]
  );

  useEffect(() => {
    initializeApp();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        initializeApp();
      });
      window.ethereum.on('chainChanged', () => {
        initializeApp();
      });
    }
  }, []);

  return {
    isWalletConnected,
    networkNotSupported,
    isLoading,
    handleWalletConnect,
  };
}

export { useInitializeApp };
