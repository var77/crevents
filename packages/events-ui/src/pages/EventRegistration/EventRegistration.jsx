import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Layout, Form, Input, Card, DatePicker, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { loadEventContract } from '../../utils/helpers';
import { selectCreatorContract } from '../../store/creatorContractSlice';
import { setEventContract } from '../../store/eventContractSlice';
import FileUpload from '../../components/FileUpload/FileUpload';

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
const defaultEvent = {
  name: 'Test event',
  description: 'test description',
  link: 'https://example.com',
  maxParticipants: 10,
  registrationEnd: dayjs(Date.now() + 1000000),
  eventDates: [dayjs(Date.now() + 2000000), dayjs(Date.now() + 800000000)],
  ticketPrice: 10000,
  preSaleTicketPrice: 9000,
};

function EventRegistration() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const creatorContract = useSelector(selectCreatorContract);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateImageUrl = (url) => {
    setImageUrl(url);
    return url;
  };

  const createEvent = (data) => {
    if (!creatorContract) {
      return;
    }
    const eventData = {
      name: data.name,
      description: data.description,
      link: data.link,
      image: imageUrl, //TODO
      maxParticipants: data.maxParticipants,
      registrationEnd: data.eventDates[0].unix(),
      start: data.eventDates[0].unix(),
      end: data.eventDates[1].unix(),
      ticketPrice: data.ticketPrice,
      preSaleTicketPrice: data.preSaleTicketPrice,
    };
    setLoading(true);
    creatorContract.methods
      .createEvent(eventData)
      .send({ from: window.selectedAddress })
      .on('confirmation', async (confirmationNumber, receipt) => {
        console.log('confirmationNumber, receipt', confirmationNumber, receipt);
        if (confirmationNumber === 1) {
          setLoading(false);
          const eventAddress = receipt.events.EventCreated.returnValues.addr;
          const eventContract = loadEventContract(eventAddress);
          window.eventContract = eventContract;
          dispatch(setEventContract(eventContract));
          navigate(`/event/${eventAddress}`);
        }
      });
  };

  const onFinish = (data) => {
    createEvent(data);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Layout
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        width: '100%',
        height: '100vh',
        margin: 20,
        backgroundColor: 'white',
      }}
    >
      <Spin spinning={loading}>
        <Card style={{ width: 600 }}>
          <Form
            layout="horizontal"
            autoComplete="off"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={defaultEvent}
          >
            <Form.Item
              label="Event name"
              name="name"
              rules={[{ required: true, message: 'Please input event name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              getValueFromEvent={updateImageUrl}
            >
              <FileUpload imageUrl={imageUrl} setImageUrl={updateImageUrl} />
            </Form.Item>
            <Form.Item label="Link" name="link">
              <Input />
            </Form.Item>
            <Form.Item label="Max participants" name="maxParticipants">
              <Input />
            </Form.Item>
            <Form.Item label="Start and end event date" name="eventDates">
              <RangePicker format={dateFormat} />
            </Form.Item>

            <Form.Item label="Ticket price" name="ticketPrice">
              <Input />
            </Form.Item>
            <Form.Item label="Pre sale ticket price" name="preSaleTicketPrice">
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Create event
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </Layout>
  );
}

export { EventRegistration };
