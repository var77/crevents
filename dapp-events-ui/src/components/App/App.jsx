/* eslint-disable no-unused-vars */
import { useInitializeApp } from '../hooks/useInitializeApp';
import { Pages } from '../Pages/Pages';

function App() {
  const {
    isLoading,
    networkNotSupported,
    handleConnect,
    isConnected,
    ...restProps
  } = useInitializeApp();

  console.log('restProps', restProps)
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
    <>
      {!isConnected && <button className="connectBtn" onClick={handleConnect}>Connect Wallet</button>}
      {isConnected && (
      <>
        <div className="mintContainer">
          {networkNotSupported && <p style={{ color: 'red' }}>Network not supported</p>}
          <Pages app={{
              isLoading,
              networkNotSupported,
              handleConnect,
              isConnected,
              ...restProps
            }}
          />
        </div>
      </>
      )}
    </>

  )
}

export default App;
