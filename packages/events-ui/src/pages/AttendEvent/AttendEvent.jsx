import { Avatar, Button, Layout, Modal, QRCode } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Divider } from 'antd';
import { loadEventContract } from '../../utils/helpers';
import { createIcon } from '@download/blockies';
import Navbar from '../../components/Navbar/Navbar';
import domtoimage from 'dom-to-image';
import saveAs from 'file-saver';
import './AttendEvent.css';
import dayjs from 'dayjs';

const { Text } = Typography;

function TicketModal({
  ticketData,
  setTicketData,
  handleDownloadTicket,
  eventInfo,
}) {
  return (
    <Modal
      open={ticketData}
      onCancel={() => setTicketData(null)}
      closable={false}
      footer={<Button onClick={handleDownloadTicket}>Download</Button>}
    >
      <div className="ticket-modal" id="ticket">
        <div
          className="ticket-modal-background"
          style={{ backgroundImage: `url(${eventInfo.image})` }}
        />
        <div className="ticket-modal-info-cont">
          <div className="ticket-modal-info">
            <Text className="ticket-modal-info-title">{eventInfo.name}</Text>
            <Text className="ticket-modal-info-starttime">
              {dayjs(eventInfo.start).format('dddd MMM DD YYYY HH:mm')}
            </Text>
          </div>
          <div>
            <QRCode size={128} value={ticketData} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

function AttendEvent() {
  const navigate = useNavigate();

  const { address: contractAddress } = useParams();
  const [contract, setContract] = useState(null);
  const [eventInfo, setEventInfo] = useState({});
  const [ticketData, setTicketData] = useState('');
  const [loading, setLoading] = useState(false);

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
      start: new Date(+info.start * 1000),
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
    try {
      setLoading(true);
      await contract.methods
        .publicRegister()
        .send({
          from: window.selectedAddress,
          value: window.web3Instance.utils.toWei(eventInfo.ticketPrice),
        })
        .on('confirmation', async (confirmationNumber, receipt) => {
          if (confirmationNumber === 1) {
            await initialize();
            setLoading(false);
          }
        });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
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

  const handleDownloadTicket = async () => {
    const blob = await domtoimage.toBlob(document.getElementById('ticket'));
    saveAs(blob, 'ticket.png');
    setTicketData(null);
  };

  useEffect(() => {
    initialize();
  }, []);

  const onGoBack = () => {
    navigate('/');
  };

  const availableTickets =
    eventInfo.maxParticipants - eventInfo.registeredParticipantCount;
  return (
    <>
      <Navbar />
      <Layout className="event-layout">
        <div className="event-header-container">
          <div
            className="event-header-big"
            style={{ backgroundImage: `url(${eventInfo.image})` }}
          />
          <img
            src={eventInfo.image}
            alt={eventInfo.name}
            className="event-info-image"
          />
        </div>
        <div className="event-info-container">
          <div className="event-details-container">
            <div className="event-title-info">
              <Text className="event-title-text">{eventInfo.name}</Text>
            </div>
            <Divider />
            <div className="event-organizer-info">
              <h3>Organizer</h3>
              <div>
                <Avatar src={eventInfo.organizerIcon} />
                <Text className="event-organizer-text">
                  {' ' + eventInfo.organizer}
                </Text>
              </div>
            </div>
            <h3>When and Where</h3>
            <div className="event-date-location-container">
              <div className="event-date-info">
                {dayjs(eventInfo.start).format('dddd MMM DD YYYY HH:mm')}
              </div>
              <Divider type="vertical" />
              <div className="event-location-info">{eventInfo.address}</div>
            </div>
            <Divider />
            <div className="event-about-container">
              <h3>About This Event</h3>
              <Text>{eventInfo.description}</Text>
            </div>
          </div>
          <div className="event-checkout-section">
            <Text className="event-checkout-section-title">
              {!eventInfo.isRegistered && <Text>Avaialble tickets {availableTickets} </Text>}
            </Text>
            {eventInfo.isRegistered ? (
              <Button onClick={showTicket}>Show Ticket </Button>
            ) : (
              <Button onClick={attendEvent} loading={loading}>
                Buy
              </Button>
            )}
          </div>
        </div>
      </Layout>

      <TicketModal
        ticketData={ticketData}
        setTicketData={setTicketData}
        handleDownloadTicket={handleDownloadTicket}
        eventInfo={eventInfo}
      />
    </>
  );
}

export { AttendEvent };
