import React from 'react'
import { Button, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CONNECTORS } from '../../utils/helpers'
import walletLoader from '../../wallet-loader.gif'

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
    const handleConnect = (connector) => {
        handleWalletConnect(connector, (status) => status && navigate(-1))
    }
    return (      
        <CenterLayout>
            <img src={walletLoader} width="10%" alt="wallet-loader" />
            <Button type="primary" onClick={() => handleConnect(CONNECTORS.METAMASK)}>Metamask</Button>
            <Button type="primary" onClick={() => handleConnect(CONNECTORS.WALLET_CONNECT)}>Wallet Connect</Button>
        </CenterLayout>)
}


export { ConnectWallet };
