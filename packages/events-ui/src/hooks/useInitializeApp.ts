/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from 'react';
import {
    connectToMetamask,
    loadContracts,
    loadWeb3
} from '../utils/helpers';
import { useDispatch } from 'react-redux'
import { setEventContract } from '../store/eventContractSlice';
import { setCreatorContract } from '../store/creatorContractSlice';

function useInitializeApp(){
    const dispatch = useDispatch()
    const [isLoading, setLoading] = useState(false);
    const [isWalletConnected, setWalletConnected] = useState(false);
    const [networkNotSupported, setNetworkNotSupported] = useState(false);

    const initializeApp = useCallback(async () => {
      setLoading(true);
      try {
        await loadWeb3();
        const [status] = await connectToMetamask(true);
        setWalletConnected(status);
        if (!status) {
          setLoading(false);
          return;
        }
        const [creatorContract, eventContract] = await loadContracts();
        if (!creatorContract) {
          setNetworkNotSupported(true);
          setLoading(false)
          return;
        }
        setNetworkNotSupported(false);
        dispatch(setEventContract(eventContract))
        dispatch(setCreatorContract(creatorContract))
      } catch(error){
        console.log('initializeApp: error', error);
      } finally {
        setLoading(false);
      }
    }, [dispatch]);

    const handleWalletConnect = useCallback(async () => {
        const [status, _address] = await connectToMetamask();
        console.log({ status, _address });
        setWalletConnected(status);
        if (status) {
          initializeApp();
        }
      }, [initializeApp]);

    useEffect(() => {
        initializeApp();
        if(window.ethereum) {
            window.ethereum.on('accountsChanged', () => {
                initializeApp();
              });
            window.ethereum.on('chainChanged', () => {
            initializeApp();
            });
        }
      }, [initializeApp]);

    return {
        isWalletConnected,
        networkNotSupported,
        isLoading,
        handleWalletConnect,
    }
}

export { useInitializeApp };
