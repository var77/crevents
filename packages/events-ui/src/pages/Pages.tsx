import { Routes, Route } from 'react-router-dom';
import { AttendEvent } from './AttendEvent/AttendEvent';
import { HomePage } from './HomePage/HomePage';
import { ConnectWallet } from './ConnectWallet/ConnectWallet';

function Pages({handleWalletConnect, isWalletConnected}) {
  console.log(handleWalletConnect, isWalletConnected, 'wallet');
  
  return (
    <Routes>
      <Route path="/" element={<HomePage isWalletConnected={isWalletConnected} />} />
      <Route path="/connect-wallet" element={<ConnectWallet handleWalletConnect={handleWalletConnect} />} />
      <Route path="/event/:address" element={<AttendEvent isWalletConnected={isWalletConnected} />} />
    </Routes>
  );
}

export { Pages };
