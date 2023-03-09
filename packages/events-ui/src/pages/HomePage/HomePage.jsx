import { Button, Layout } from 'antd';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { createIcon } from '@download/blockies';
import EventCard from '../../components/EventCard/EventCard';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

function HomePage() {
  const navigate = useNavigate();

  const onAttendEvent = (address) => {
    navigate(`/event/${address}`);
  };

  const onRegisterEvent = () => {
    navigate('/event-registration');
  };

  const [events, setEvents] = useState([]);

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
        onlyWhitelistRegistration: info.onlyWhitelistRegistration,
        preSaleTicketPrice: window.web3Instance.utils.fromWei(
          info.preSaleTicketPrice
        ),
        registrationEnd: new Date(+info.registrationEnd),
        registrationOpen: info.registrationOpen,
        registeredParticipantCount: info.registeredParticipantCount,
        checkedParticipantCount: info.checkedParticipantCount,
        isRegistered: info.isRegistered,
        isChecked: info.isChecked,
        start: moment(new Date(+info.start * 1000)).format(
          'MMMM DD YYYY HH:MM'
        ),
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
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <Layout
      style={{
        backgroundColor: 'white',
        width: '100%',
        height: '100vh',
      }}
    >
      <Header onRegisterEvent={onRegisterEvent} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {events.map((eventInfo) => (
          <EventCard
            key={eventInfo.address}
            eventInfo={eventInfo}
            onAttendEvent={onAttendEvent}
          />
        ))}
      </div>
      <Footer />
    </Layout>
  );
}

export { HomePage };
