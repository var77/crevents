import { Avatar, Button, Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { Card, Typography, Divider } from 'antd';
import { loadEventContract } from '../../utils/helpers';
import { createIcon } from '@download/blockies';
import { GlobalOutlined } from '@ant-design/icons';
import Navbar from '../../components/Navbar/Navbar'
import './AttendEvent.css';

const { Title, Text } = Typography;

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
      end: new Date(+info.end * 1000).toDateString(),
      link: info.link,
      maxParticipants: +info.maxParticipants,
      name: info.name,
      onlyWhitelistRegistration: info.onlyWhitelistRegistration,
      preSaleTicketPrice: window.web3Instance.utils.fromWei(
        info.preSaleTicketPrice
      ),
      registrationEnd: new Date(+info.registrationEnd * 1000).toDateString(),
      registrationOpen: info.registrationOpen,
      registeredParticipantCount: info.registeredParticipantCount,
      checkedParticipantCount: info.checkedParticipantCount,
      isRegistered: info.isRegistered,
      isChecked: info.isChecked,
      start: new Date(+info.start * 1000).toDateString(),
      ticketPrice: window.web3Instance.utils.fromWei(info.ticketPrice),
      organizer: info.organizer,
      image: info.image,
      organizerIcon: createIcon({
        seed: info.organizer,
        size: 16,
        scale: 8,
      }).toDataURL(),
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

  const availableTickets = eventInfo.maxParticipants - eventInfo.registeredParticipantCount
  return (
    <div>
    <Navbar />
    <Card
      className="event-details"

      cover={
        <img
          className="event-details-image"
          alt="event cover"
          src={eventInfo.image}
        />
      }
      extra={
        <Text type="secondary">
          Registration Ends: {eventInfo.registrationEnd}
        </Text>
      }
    >
      {ticketData && (
        <>
          <QRCode value={ticketData} /> <Divider />
        </>
      )}
      <div className='event-container'>
        <div className='event-content'>
        <div className='event-details-header'>
          <div className='event-details-section'>
            <Text className='event-details-startTime'>{eventInfo.start}</Text>
            <Text className="event-details-title">{eventInfo.name}</Text>
          </div>
            <Text>
              Registration: {eventInfo.registrationOpen ? 'Open' : 'Closed'}
            </Text>
        </div>
        <div className='event-details-section'>
          <Text className='event-details-section-header'> About this event</Text>
          <Text className="event-details-about-description">{eventInfo.description}</Text>
        </div>
        <div className='event-details-section'>
        <Text className='event-details-section-header'>Location</Text>
          <div className='event-details-location-info'>
            <GlobalOutlined className='event-details-icons' />
            <Text>{eventInfo.address || 'YEREVAN CITADEL'}</Text>
          </div>
        </div>
        <Divider />
        <Text>
          Organizer: <Avatar src={eventInfo.organizerIcon} />{' '}
          {eventInfo.organizer}
        </Text>
        <Divider />
        <Text>
          Ticket Prices: {eventInfo.preSaleTicketPrice} (Pre-Sale) /{' '}
          {eventInfo.ticketPrice} (Regular)
        </Text>
        <Divider />
        <Text>Link: {eventInfo.link}</Text>
        </div>
        <div className='event-checkout-section'>
            <Text className='event-checkout-section-title'> 
              {eventInfo.isRegistered ? (
                <Text type="success">(You are registered)</Text>
              ) :(
                <Text>Avaialble tickets {availableTickets} </Text>
              ) } 
          </Text>
          {eventInfo.isRegistered ? (
            <Button onClick={showTicket}>Show Ticket </Button>
          ) : (
            <Button onClick={attendEvent}>Buy</Button>
          )}
        </div>
      </div>
    </Card>
    </div>

  );
}

export { AttendEvent };
