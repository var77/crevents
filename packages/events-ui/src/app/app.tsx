import { Spin, Layout, Alert } from 'antd';
import { Pages } from '../pages/Pages';
import { useInitializeApp } from '../hooks/useInitializeApp';
import FooterComponent from '../components/Footer/Footer';

const CenterLayout = ({ children }) => {
  return (
    <Layout
      style={{
        backgroundColor: 'transparent',
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </Layout>
  );
};

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
        <Spin size="large" tip="Loading..."></Spin>
      </CenterLayout>
    );
  }

  if (networkNotSupported) {
    return (
      <CenterLayout>
      <Alert
        message="Network not supported"
        description={`Please select network from list.`}
        type="error"
      />
        <FooterComponent />
      </CenterLayout>
    );
  }

  return (
    <Pages
      handleWalletConnect={handleWalletConnect}
      isWalletConnected={isWalletConnected}
    />
  );
}

export default App;
