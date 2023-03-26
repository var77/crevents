import { Layout, Modal } from 'antd';
import { useState } from 'react';
import QrReader from 'react-qr-scanner';
import { loadEventContract } from '../../utils/helpers';

const verifyTicket = async (data) => {
  try {
    alert(data.text);
    const { hash, signature, address } = JSON.parse(data.text);
    if (!address || !hash || !signature) return false;
    const signer = await window.web3Instance.eth.personal.ecRecover(
      hash,
      signature
    );
    alert(`signer:: ${signer}`);
    if (!signer) return false;
    const contract = loadEventContract(address);
    const isVerified = await contract.methods.verifyTicket(signer).call();

    return isVerified;
  } catch (err) {
    alert(err.message);
    console.error(err);
    return false;
  }
};

const VerifyTicket = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const closePopup = () => setPopupOpen(false);
  const handleTicketVerify = async (data) => {
    if (!data || isPopupOpen) return;
    const isValid = await verifyTicket(data);
    if (isValid) {
      setPopupOpen(true);
      return Modal.success({
        title: 'Ticket is valid',
        onOk: closePopup,
        onCancel: closePopup,
      });
    }
    return Modal.error({
      title: 'Invalid Ticket',
      onOk: closePopup,
      onCancel: closePopup,
    });
  };
  return (
    <Layout>
      <QrReader
        constraints={{
          video: { facingMode: 'environment' },
        }}
        onError={(e) => alert(e.message)}
        delay={2000}
        style={{ width: '100%', height: '100%' }}
        onScan={handleTicketVerify}
      />
    </Layout>
  );
};

export { VerifyTicket };
