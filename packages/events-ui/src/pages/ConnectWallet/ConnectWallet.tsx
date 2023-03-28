import React from 'react';
import { Card, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CONNECTORS } from '../../utils/helpers';
import walletLoader from '../../wallet-loader.gif';

const CenterLayout = ({ children }) => {
  return (
    <Layout
      style={{
        backgroundColor: 'transparent',
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      {children}
    </Layout>
  );
};

const ConnectWallet = ({ handleWalletConnect }) => {
  const navigate = useNavigate();
  const handleConnect = (connector) => {
    handleWalletConnect(connector, (status) => status && navigate(-1));
  };
  return (
    <CenterLayout>
      <Card
        style={{ marginRight: 30 }}
        cover={<img src="../../assets/metamask.png" alt="Metamask"/>}
        hoverable={true}
        onClick={() => handleConnect(CONNECTORS.METAMASK)}
      />
      <Card
        cover={<img src="../../assets/walletconnect.png" alt="Wallet Connect"/>}
        hoverable={true}
        onClick={() => handleConnect(CONNECTORS.WALLET_CONNECT)}
      />
    </CenterLayout>
  );
};

export { ConnectWallet };
