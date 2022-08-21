/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from 'react';
import {
    connectToMetamask,
    loadContracts,
    loadWeb3
} from '../../utils/helpers';

function useInitializeApp(){
    const [isConnected, setConnected] = useState(false);
    const [networkNotSupported, setNetworkNotSupported] = useState(false);
    const [eventContract, setEventContract] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [creatorContract, setCreatorContract] = useState(null);

    const initializeApp = async () => {
        setLoading(true);
        await loadWeb3();
        const [status, address] = await connectToMetamask(true);
        setConnected(status);
        if (!status) {
          setLoading(false);
          return;
        }
        const [creatorContract, eventContract] = await loadContracts();
        if (!creatorContract) {
          setNetworkNotSupported(true);
          return setLoading(false);
        }
        setNetworkNotSupported(false);
        setCreatorContract(creatorContract);
        setEventContract(eventContract);
        setLoading(false);
      };

    const handleConnect = useCallback(async () => {
        const [status, _address] = await connectToMetamask();
        setConnected(status);
        if (status) {
          initializeApp();
        }
      }, []);

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
      }, []);

    return {
        isConnected,
        handleConnect,
        networkNotSupported,
        isLoading,
        creatorContract,
        eventContract,
        setEventContract
    }
}

export { useInitializeApp };