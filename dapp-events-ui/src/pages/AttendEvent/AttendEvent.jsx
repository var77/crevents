import { Button, Layout } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { loadEventContract } from '../../utils/helpers';
import underConstruction from './under-construction.gif';


function AttendEvent(){
    const navigate = useNavigate();
    const { address: contractAddress } = useParams();
    const [contract, setContract] = useState(null);
    const [eventInfo, setEventInfo] = useState({});
    
    const initialize = async () => {
      const eventContract = loadEventContract(contractAddress);
      const info = await eventContract.methods.getEventInfo(Math.floor(Date.now() / 1000)).call();
      setEventInfo({
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
        ticketPrice: window.web3Instance.utils.fromWei(info.ticketPrice)
      });
      setContract(eventContract);
    };


    const attendEvent = async () => {
      await contract.methods.publicRegister().send({ from: window.selectedAddress, value: window.web3Instance.utils.toWei(eventInfo.ticketPrice) });
    }

    useEffect(() => {
      initialize();
    }, []);
    const onGoBack = () => {
        navigate('/')
    }

    return (
        <Layout style={{
            backgroundColor: 'white',
            width: '100%',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      {JSON.stringify(eventInfo, null, 2)}
            </div>
            <Button type='primary' onClick={attendEvent}>
                Attend
            </Button>
            <Button type='primary' onClick={onGoBack}>
                Home
            </Button>
        </Layout>
    )
}

export { AttendEvent }
