import { Button, Layout } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import welcome from './welcome.gif';

function HomePage(){
    const navigate = useNavigate();

    const onAttendEvent = () => {
        navigate('/event/:address')
    }

    const onRegisterEvent = () => {
        navigate('/event-registration')
    }

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
                <Button type="primary" style={{ marginLeft: 40 }} onClick={onAttendEvent}>
                    Attend Event
                </Button>
            </div>
        </Layout>
    )
}

export { HomePage }