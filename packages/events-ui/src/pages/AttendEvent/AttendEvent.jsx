import { Button, Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QRCode from "react-qr-code";
import { loadEventContract } from '../../utils/helpers';
import underConstruction from './under-construction.gif';

function AttendEvent() {
  const navigate = useNavigate();
  const { address: contractAddress } = useParams();
  const [contract, setContract] = useState(null);
  const [eventInfo, setEventInfo] = useState({});
  const [ticketData, setTicketData] = useState('');

  const initialize = async () => {
    const eventContract = loadEventContract(contractAddress);
    const info = await eventContract.methods
      .getEventInfo(Math.floor(Date.now() / 1000))
      .call({ from: window.selectedAddress });
    setEventInfo({
      description: info.description,
      end: new Date(+info.end * 1000),
      link: info.link,
      maxParticipants: +info.maxParticipants,
      name: info.name,
      onlyWhitelistRegistration: info.onlyWhitelistRegistration,
      preSaleTicketPrice: window.web3Instance.utils.fromWei(
        info.preSaleTicketPrice
      ),
      registrationEnd: new Date(+info.registrationEnd * 1000),
      registrationOpen: info.registrationOpen,
      registeredParticipantCount: info.registeredParticipantCount,
      checkedParticipantCount: info.checkedParticipantCount,
      isRegistered: info.isRegistered,
      isChecked: info.isChecked,
      start: new Date(+info.start * 1000),
      ticketPrice: window.web3Instance.utils.fromWei(info.ticketPrice),
    });
    setContract(eventContract);
  };

  const attendEvent = async () => {
    await contract.methods.publicRegister().send({
      from: window.selectedAddress,
      value: window.web3Instance.utils.toWei(eventInfo.ticketPrice),
    });
  };

  const getMyTicket = async () => {
    const nonce = Date.now().toString();
    const hash = window.web3Instance.utils.sha3(nonce);
    const signature = await window.web3Instance.eth.personal.sign(
      hash,
      window.web3Instance.utils.toChecksumAddress(window.selectedAddress)
    );
    return { hash, signature };
  };

  const showTicket = async () => {
    try {
      const data = await getMyTicket();
      setTicketData(JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    initialize();
  }, []);
  const onGoBack = () => {
    navigate('/');
  };

  return (
    <Layout
      style={{
        backgroundColor: 'white',
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {ticketData && (
        <div
          style={{
            height: 'auto',
            margin: '0 auto',
            maxWidth: 256,
            width: '100%',
          }}
        >
          <QRCode
            size={256}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            value={ticketData}
            viewBox={`0 0 256 256`}
          />
        </div>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {JSON.stringify(eventInfo, null, 2)}
      </div>
      <Button type="primary" onClick={attendEvent}>
        Attend
      </Button>
      {eventInfo?.isRegistered && (
        <Button type="primary" onClick={showTicket}>
          Show Ticket
        </Button>
      )}
      <Button type="primary" onClick={onGoBack}>
        Home
      </Button>
    </Layout>
  );
}

export { AttendEvent };
