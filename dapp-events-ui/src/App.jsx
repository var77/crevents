/* eslint-disable no-unused-vars */
import { Pages } from './pages/Pages';
import { useInitializeApp } from './hooks/useInitializeApp';
import { Button, Layout } from 'antd';
import walletLoader from './wallet-loader.gif'

const CenterLayout = ({ children }) => {
  return (
    <Layout style={{
      backgroundColor: 'white',
      width: '100%',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center'
  }}>
    {children}
  </Layout>
  )
}


function App() {
  const {
    isLoading,
    networkNotSupported,
    isConnected,
    handleWalletConnect,
  } = useInitializeApp();

  if (isLoading) {
    return (
      <CenterLayout>
        <p>Loading...</p>
      </CenterLayout>
    );
  }

  if (networkNotSupported) {
    return (
      <CenterLayout>
        <p style={{ color: 'red' }}>Network not supported please change it from MetaMask</p>
      </CenterLayout>
    );
  }

  if(networkNotSupported){
    return (
      <CenterLayout>
        <p style={{ color: 'red' }}>Network not supported</p>
      </CenterLayout>
    )
  }

  if(!isConnected){
    return (
      <CenterLayout>
        <img src={walletLoader} width="10%" alt="wallet-loader" />
        <Button type="primary" onClick={handleWalletConnect}>Connect your wallet</Button>
      </CenterLayout>
    )
  }

  return (
    <>
      <Pages />
    </>
  )
}

export default App;
