import React from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Button, Layout, Form, Input, Card, DatePicker } from 'antd';
import { loadEventContract } from '../../../utils/helpers';

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
const defaultEvent = {
    name: "Test event",
    description: "test description",
    link: "https://example.com",
    maxParticipants: 10,
    registrationEnd: Date.now() + 100000,
    start: Date.now() + 200000,
    end: Date.now() + 40000,
    ticketPrice: 10000,
    preSaleTicketPrice: 9000,
};

function EventRegistration({ app: { creatorContract, setEventContract }}) {
    const navigate = useNavigate();
    console.log('createEvent', creatorContract)
    const createEvent = (data) => {
        console.log('createEvent: data', data, creatorContract)
        if (!creatorContract) {
            return;
        }
        console.log('after if')
        creatorContract.methods.createEvent({
            ...defaultEvent,
            name: data.name,
            description: data.description,
            link: data.link,
            maxParticipants: Number(data.maxParticipants),
        }).send({ from: window.selectedAddress }).on('confirmation', async (confirmationNumber, receipt) => {
            console.log('confirmationNumber, receipt', confirmationNumber, receipt)
            if (confirmationNumber === 1) {
                const eventAddress = receipt.events.EventCreated.returnValues.addr;
                const eventContract = loadEventContract(eventAddress)
                window.eventContract = eventContract;
                setEventContract(eventContract);
                navigate(`/event/${eventAddress}`);
            }
        });
    }

    const onFinish = (data) => {
        createEvent(data);
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    return (
        <Layout style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            width: '100%',
            height: '100vh',
            margin: 20,
            backgroundColor: 'white'
        }}>
            <Card style={{ width: 600 }}>
                <Form
                    layout="horizontal"
                    autoComplete="off"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Event name"
                        name="name"
                        rules={[{ required: true, message: 'Please input event name' }]}
                        >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Link"
                        name="link"
                        >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Max participants"
                        name="maxParticipants"
                        rules={[{ required: true, message: 'Field is required!' }]}
                        >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Closing registration date"
                        name="registrationEnd"
                        >
                        <DatePicker
                            defaultValue={moment('2015/01/01', dateFormat)}
                            format={dateFormat}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Start and end event date"
                        name="registrationEnd"
                        >
                        <RangePicker
                            defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                            format={dateFormat}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Ticket price"
                        name="ticketPrice"
                        >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Pre sale ticket price"
                        name="preSaleTicketPrice"
                        >
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Create event
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Layout>
    );
}

export { EventRegistration }