/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo } from 'react';

import {
  connectToMetamask, loadContracts, loadWeb3, ZERO_ADDRESS,
} from '../../utils/helpers';

function App() {
  const [isConnected, setConnected] = useState(false);
  const [networkNotSupported, setNetworkNotSupported] = useState(false);
  const [creatorContract, setEventContract] = useState(null);
  const initializeApp = async () => {
    setLoading(true);
    subscription?.unsubscribe();
    await loadWeb3();
    const [status, address] = await connectToMetamask(true);
    setConnected(status);
    if (!status) {
      setLoading(false);
      return;
    }
    const [creatorContract, eventContract] = await loadContracts();
    if (!creatorContract || !eventContract) {
      setNetworkNotSupported(true);
      return setLoading(false);
    }
    setNetworkNotSupported(false);
    setCreatorContract(creatorContract);
    setEventContract(eventContract);

    setSubscription(sub);
    setLoading(false);
  };

  const handleConnect = async () => {
    const [status, _address] = await connectToMetamask();
    setConnected(status);
    if (status) {
      initializeApp();
    }
  };

  useEffect(() => {
    initializeApp();

    window.ethereum.on('accountsChanged', () => {
      initializeApp();
    });
    window.ethereum.on('chainChanged', () => {
      initializeApp();
    });
  }, []);

  if (isLoading) {
    return (
      <div className="App">
        <p>Loading...</p>
      </div>
    );
  }

  if (networkNotSupported) {
    return (
      <div className="App">
        <p style={{ color: 'red' }}>Network not supported please change it from MetaMask</p>
      </div>
    );
  }

  return (
    <div className="App">
      { !isConnected && <button className="connectBtn" onClick={handleConnect}>Connect Wallet</button>}
      { isConnected && (
      <>
        <div className="mintContainer">
          {networkNotSupported && <p style={{ color: 'red' }}>Network not supported</p>}
        </div>
      </>
      ) }
    </div>

  );
}

export default App;
