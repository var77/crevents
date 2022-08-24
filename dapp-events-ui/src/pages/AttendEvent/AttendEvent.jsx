import { Button, Layout } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import underConstruction from './under-construction.gif';


function AttendEvent(){
    const navigate = useNavigate();

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
                <img src={underConstruction} width='100%' alt="welcome" />
            </div>
            <Button type='primary' onClick={onGoBack}>
                Home
            </Button>
        </Layout>
    )
}

export { AttendEvent }