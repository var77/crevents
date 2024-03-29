import {
  Avatar,
  Button,
  Layout,
  Modal,
  QRCode,
  Typography,
  Divider,
} from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadEventContract } from '../../utils/helpers';
import { createIcon } from '@download/blockies';
import domtoimage from 'dom-to-image';
import saveAs from 'file-saver';
import './AttendEvent.css';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { getGasPrice } from '../../utils/helpers';

const { Text, Paragraph } = Typography;

dayjs.extend(duration);
dayjs.extend(relativeTime);

function NewlineText(props) {
  const text = props.text || '';
  const newText = text.split('\n').map(str => <Paragraph>{str}</Paragraph>);
  
  return newText;
}

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
      centered
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

function AttendEvent({ isWalletConnected }) {
  const navigate = useNavigate();

  const { address: contractAddress } = useParams();
  const [contract, setContract] = useState(null);
  const [eventInfo, setEventInfo] = useState({ ticketPrice: ' ' });
  const [ticketData, setTicketData] = useState('');
  const [loading, setLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const initialize = async () => {
    try {
      const eventContract = loadEventContract(contractAddress);
      const info = await eventContract.methods
        .getEventInfo(Math.floor(Date.now() / 1000))
        .call({ from: window.selectedAddress });
      const balance = window.web3Instance.utils.fromWei(
        await window.web3Instance.eth.getBalance(eventContract.options.address)
      );
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
        location: info.location,
        isRegistered: info.isRegistered,
        isChecked: info.isChecked,
        start: new Date(+info.start * 1000),
        ticketPrice: window.web3Instance.utils.fromWei(info.ticketPrice),
        organizer: info.organizer,
        image: info.image,
        duration: dayjs
          .duration(dayjs(info.end * 1000).diff(dayjs(+info.start * 1000)))
          .humanize(),
        organizerIcon: createIcon({
          seed: info.organizer,
          size: 16,
          scale: 8,
        }).toDataURL(),
        address: info.addr,
        balance,
        isOwner: info.organizer === window.selectedAddress,
      });
      setContract(eventContract);
    } catch {
      navigate('/');
    }
  };

  const attendEvent = async () => {
    try {
      if (!isWalletConnected) {
        return navigate('/connect-wallet');
      }
      setLoading(true);
      const gasInfo = await getGasPrice();
      await contract.methods
        .publicRegister()
        .send({
          from: window.selectedAddress,
          value: window.web3Instance.utils.toWei(eventInfo.ticketPrice),
          ...gasInfo,
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

  const withdrawBalance = async () => {
    try {
      if (!isWalletConnected) {
        return navigate('/connect-wallet');
      }
      setWithdrawLoading(true);
      await contract.methods
        .withdraw()
        .send({
          from: window.selectedAddress,
          value: 0,
        })
        .on('confirmation', async (confirmationNumber) => {
          if (confirmationNumber === 1) {
            await initialize();
            setWithdrawLoading(false);
          }
        });
    } catch (err) {
      console.error(err);
      setWithdrawLoading(false);
    }
  };

  const getMyTicket = async () => {
    const nonce = Date.now().toString();
    const signature = await window.web3Instance.eth.personal.sign(
      nonce,
      window.web3Instance.utils.toChecksumAddress(window.selectedAddress)
    );
    return { hash: nonce, signature, address: eventInfo.address };
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
    eventInfo.maxParticipants === 0
      ? '∞'
      : eventInfo.maxParticipants - eventInfo.registeredParticipantCount;
  return (
    <>
      <Header isWalletConnected={isWalletConnected} hideCreateEventBtn />
      <Layout className="event-layout">
        <div className="event-main-cont">
          <div className="event-header-container">
            <div className="event-header-big-cont">
              <div
                className="event-header-big-img"
                style={{ backgroundImage: `url(${eventInfo.image})` }}
              />
            </div>
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
                <Text className="event-info-section-title">Organizer</Text>
                <div>
                  <Avatar
                    src={eventInfo.organizerIcon}
                    size={50}
                    style={{ marginRight: '16px' }}
                  />
                  <Text className="event-organizer-text">
                    {eventInfo.organizer}
                  </Text>
                </div>
              </div>
              <Divider />
              <Text className="event-info-section-title">When and Where</Text>
              <div className="event-date-location-container">
                <div className="event-date-info">
                  <div className="event-date-info-container">
                    <div>
                      <CalendarOutlined style={{ fontSize: 50 }} />
                    </div>
                    <div className="event-date-text-container">
                      <Text className="event-date-title">Date and time</Text>
                      <Text className="event-date-text">
                        {dayjs(eventInfo.start).format(
                          'dddd MMM DD YYYY HH:mm'
                        )}
                      </Text>
                    </div>
                  </div>
                </div>
                <div className="event-location-container">
                  <div>
                    <img
                      src="/assets/location.png"
                      width={50}
                      height={50}
                      alt="location"
                    />
                  </div>
                  <div className="event-date-text-container">
                    <Text className="event-date-title">Location</Text>
                    <Text className="event-date-text event-location-info">
                      {eventInfo.location || 'Not Specified'}
                    </Text>
                  </div>
                </div>
              </div>
              <Divider />
              <div className="event-about-container">
                <Text className="event-info-section-title">
                  About This Event
                </Text>
                <div className="event-duration-container">
                  <ClockCircleOutlined
                    style={{ fontSize: 40, color: 'gray', marginRight: '10px' }}
                  />
                  <Text className="event-duration-text">
                    {eventInfo.duration}
                  </Text>
                </div>
                  <NewlineText text={eventInfo.description} />
              </div>
            </div>
            <div>
              <div
                className="event-checkout-section"
                style={{ marginBottom: 16 }}
              >
                <Text className="event-checkout-section-title">
                  {!eventInfo.isRegistered && (
                    <Text>Available tickets {availableTickets} </Text>
                  )}
                </Text>
                {eventInfo.isRegistered ? (
                  <Button onClick={showTicket}>Show Ticket </Button>
                ) : (
                  <Button
                    disabled={!eventInfo.registrationOpen}
                    onClick={attendEvent}
                    loading={loading}
                  >
                    Buy {eventInfo.ticketPrice} {window.currency}
                  </Button>
                )}
              </div>
              {eventInfo.isOwner && (
                <div className="event-checkout-section">
                  <Text className="event-checkout-section-title">
                    <Text>
                      Contract balance {eventInfo.balance} {window.currency}{' '}
                    </Text>
                  </Text>
                  <Button
                    disabled={!eventInfo.registrationOpen}
                    onClick={withdrawBalance}
                    loading={withdrawLoading}
                  >
                    Withdraw
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
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
