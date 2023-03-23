import { Button, Col, Layout, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { createIcon } from '@download/blockies';
import EventRegistrationModal from '../../components/EventRegistrationModal/EventRegistrationModal';
import EventCard from '../../components/EventCard/EventCard';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './HomePage.css';
import dayjs from 'dayjs';

function CardsSkeleton() {
  return (
    <>
      <EventCard eventInfo={{}} loading={true} />
      <EventCard eventInfo={{}} loading={true} />
      <EventCard eventInfo={{}} loading={true} />
    </>
  );
}

function HomePage({isWalletConnected}) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState(null)
  const [openEventEditModal, setOpenEventEditModal] = useState(false);
  const [showEventRegistration, setShowEventRegistration] = useState(false);

  const onAttendEvent = (address) => {
    navigate(`/event/${address}`);
  };

  const onRegisterEvent = () => {
    isWalletConnected ? setShowEventRegistration(true) : navigate('/connect-wallet');
  };

  const initialize = async () => {
    const eventsInfo = await window.creatorContract.methods
      .getEvents(0, 10, Math.floor(Date.now() / 1000))
      .call();
    setEvents(
      eventsInfo.map((info) => ({
        description: info.description,
        end: new Date(+info.end * 1000),
        link: info.link,
        maxParticipants: +info.maxParticipants,
        name: info.name,
        location: info.location,
        onlyWhitelistRegistration: info.onlyWhitelistRegistration,
        preSaleTicketPrice: window.web3Instance.utils.fromWei(
          info.preSaleTicketPrice
        ),
        registrationEnd: dayjs(+info.registrationEnd * 1000),
        registrationOpen: info.registrationOpen,
        registeredParticipantCount: info.registeredParticipantCount,
        checkedParticipantCount: info.checkedParticipantCount,
        isRegistered: info.isRegistered,
        isChecked: info.isChecked,
        start: dayjs(+info.start * 1000).format(
          'MMMM DD YYYY HH:MM'
        ),
        eventDates: [dayjs(+info.start * 1000), dayjs(+info.end * 1000)],
        ticketPrice: window.web3Instance.utils.fromWei(info.ticketPrice),
        address: info.addr,
        organizer: info.organizer,
        image: info.image,
        organizerIcon: createIcon({
          seed: info.organizer,
          size: 16,
          scale: 8,
        }).toDataURL(),
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    initialize();
  }, []);
  return (
    <>
    <Layout
      style={{
        background: 'transparent',
        width: '100%',
        height: '100vh',
      }}
    >
      <Header isWalletConnected={isWalletConnected} onRegisterEvent={onRegisterEvent} />
      <EventRegistrationModal
        open={showEventRegistration}
        handleCancel={() => setShowEventRegistration(false)}
      />
      <div
      className='main-cont'
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {loading ? (
          <CardsSkeleton />
        ) : (
          <>
            {!!events.length && <Row gutter={[16, 16]} style={{height: '100%'}}>
            {events.map((eventInfo) => (
        <Col style={{ display: 'flex', justifyContent: 'center'}} key={eventInfo.address} xs={24} sm={24} md={12} lg={8} xl={8}>
          <EventCard
            eventInfo={eventInfo}
            onAttendEvent={onAttendEvent}
            setEventInfo={setEventInfo}
            setOpenEventEditModal={setOpenEventEditModal}
          />
        </Col>
      ))}
    </Row>}
          </>
        )}
      </div>
      <Footer />
    </Layout>
    <EventRegistrationModal editEvent eventInfo={eventInfo} open={openEventEditModal} handleCancel={()=>{setOpenEventEditModal(false); setEventInfo(null)}} title='Edit event' actionTitle='Save event' />
    </>
  );
}

export { HomePage };
