import React from 'react'
import { Button, Layout } from 'antd';
import walletLoader from '../../wallet-loader.gif'
import { useNavigate } from 'react-router-dom';

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


const ConnectWallet = ({ handleWalletConnect }) => {
    const navigate = useNavigate()
    const handleConnect = () => {
        handleWalletConnect((status) => status && navigate(-1))
    }
    return (      
        <CenterLayout>
            <img src={walletLoader} width="10%" alt="wallet-loader" />
            <Button type="primary" onClick={handleConnect}>Connect your wallet</Button>
        </CenterLayout>)
}


export { ConnectWallet };
