import { Pages } from '../pages/Pages';
import { useInitializeApp } from '../hooks/useInitializeApp';
import { Button, Layout } from 'antd';
import walletLoader from '../wallet-loader.gif'

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
    isWalletConnected,
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


  return (
    <>
     <Pages handleWalletConnect={handleWalletConnect} isWalletConnected={isWalletConnected} />
    </>
  )
}

export default App;
