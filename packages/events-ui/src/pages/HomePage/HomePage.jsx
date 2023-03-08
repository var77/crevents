import { Button, Layout } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import welcome from './welcome.gif';

function HomePage(){
    const navigate = useNavigate();

    const onAttendEvent = (address) => {
        navigate(`/event/${address}`);
    }

    const onRegisterEvent = () => {
        navigate('/event-registration')
    }

    const [events, setEvents] = useState([]);
    
    const initialize = async () => {
      const eventsInfo = await window.creatorContract.methods.getEvents(0, 10, Math.floor(Date.now() / 1000)).call()
      setEvents(eventsInfo.map(info => ({
        description: info.description,
        end: new Date(+info.end),
        link: info.link,
        maxParticipants: +info.maxParticipants,
        name: info.name,
        onlyWhitelistRegistration: info.onlyWhitelistRegistration,
        preSaleTicketPrice: window.web3Instance.utils.fromWei(info.preSaleTicketPrice),
        registrationEnd: new Date(+info.registrationEnd),
        registrationOpen: info.registrationOpen,
        registeredParticipantCount: info.registeredParticipantCount,
        checkedParticipantCount: info.checkedParticipantCount,
        isRegistered: info.isRegistered,
        isChecked: info.isChecked,
        start: new Date(+info.start),
        ticketPrice: window.web3Instance.utils.fromWei(info.ticketPrice),
        address: info.addr
      })));
    };



    useEffect(() => {
      initialize();
    }, []);

    return (
        <Layout style={{
            backgroundColor: 'white',
            width: '100%',
            height: '100vh',
        }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <img src={welcome} width={'30%'} alt="welcome" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button type="primary" onClick={onRegisterEvent}>
                    Register Event
                </Button>
                {events.map(eventInfo => (
                  <React.Fragment key={eventInfo.address}>
                  <p>{eventInfo.name}</p>
                  <Button type="primary" style={{ marginLeft: 40 }} onClick={() => onAttendEvent(eventInfo.address)}>
                      Attend Event
                  </Button>
                  </React.Fragment>
                ))}
            </div>
        </Layout>
    )
}

export { HomePage }
