import { Grid, Layout, List, Typography, useBreakpoint } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIcon } from '@download/blockies';
import EventRegistrationModal from '../../components/EventRegistrationModal/EventRegistrationModal';
import EventCard from '../../components/EventCard/EventCard';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './HomePage.css';
import dayjs from 'dayjs';

function CardsSkeleton() {
  const items = [
    {},
    {},
    {},
    {},
  ]
  return (
      <List
      grid={{ gutter: 32, xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
      dataSource={items}
      renderItem={(eventInfo) => (
        <List.Item>
          <EventCard
            eventInfo={{}}
            loading={true}
          />
        </List.Item>
      )}
    />
  )
}

function HomePage({ isWalletConnected }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState(null);
  const [openEventEditModal, setOpenEventEditModal] = useState(false);
  const [showEventRegistration, setShowEventRegistration] = useState(false);
  const { useBreakpoint } = Grid;
  const breakpoints = useBreakpoint();
  const onAttendEvent = (address) => {
    navigate(`/event/${address}`);
  };
  const onRegisterEvent = () => {
    isWalletConnected
      ? setShowEventRegistration(true)
      : navigate('/connect-wallet');
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
        start: dayjs(+info.start * 1000).format('MMMM DD YYYY HH:MM'),
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
    <div style={{
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Header isWalletConnected={isWalletConnected} onRegisterEvent={onRegisterEvent} />
    <Layout
      style={{
        background: 'transparent',
        width: '100%',
      }}
    >
       {/*///////////////////      TO DO HERO SECTION    ///////////////////*/}


      <Layout 
      style={{
        background: 'transparent',
        width: '100%',
        padding: '50px 50px 50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 300,
      }}>
        <Typography style={{ fontSize: 65, fontWeight: 700, color: '#d99c51' }} >
            Create Events with Crevents
        </Typography>
        <div style={{ width: 900, color: 'white', fontStyle: 'italic', textAlign: 'center', fontSize: 18 }}>
        Crevents is the ultimate event management solution for both organizers and attendees. Our platform allows you to create, manage, and attend events with ease, all powered by the security and transparency of blockchain technology. Join Crevents today and take your event experience to the next level. 
        </div>
      </Layout>



      <EventRegistrationModal
        open={showEventRegistration}
        handleCancel={() => setShowEventRegistration(false)}
      />
      <div
      className='main-cont'
        style={{
          display: 'flex',
        }}
      >
        {loading ? (
          <CardsSkeleton />
        ) : (
          <>
            {!!events.length &&
              <List
              grid={{
                gutter: 32, xs: 1, sm: 1, md: 2, lg: 3, xl: 3
              }}
              loadMore
              dataSource={events}
              renderItem={(eventInfo) => (
                <List.Item>
                  <EventCard
                    eventInfo={eventInfo}
                    onAttendEvent={onAttendEvent}
                    setEventInfo={setEventInfo}
                    setOpenEventEditModal={setOpenEventEditModal}
                  />
                </List.Item>
              )}
            />}
          </>
        )}
      </div>
    </Layout>
    <Footer />
    <EventRegistrationModal editEvent eventInfo={eventInfo} open={openEventEditModal} handleCancel={()=>{setOpenEventEditModal(false); setEventInfo(null)}} title='Edit event' actionTitle='Save event' />
    </div>
  );
}

export { HomePage };
