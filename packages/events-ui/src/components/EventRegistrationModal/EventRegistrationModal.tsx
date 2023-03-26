import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  Card,
  DatePicker,
  Spin,
  InputNumber,
  Modal,
  Checkbox,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
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
  location: 'Yerevan',
  link: 'https://example.com',
  maxParticipants: 10,
  registrationEnd: dayjs(Date.now() + 1000000),
  eventDates: [dayjs(Date.now() + 2000000), dayjs(Date.now() + 800000000)],
  ticketPrice: 0.001,
  preSaleTicketPrice: 0,
  registrationOpen: true,
};

export default function EventRegistrationModal({ editEvent = false, handleCancel, eventInfo, open, title = "Create event", actionTitle="Create event" }) {
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
    let eventData = {
      name: data.name,
      description: data.description || "",
      link: data.link || "",
      image: imageUrl, //TODO
      maxParticipants: data.maxParticipants || 0,
      registrationEnd: data.eventDates[0] ? data.eventDates[0].unix() : 0,
      start: data.eventDates[0].unix(),
      end: data.eventDates[1].unix(),
      ticketPrice: data.ticketPrice
      ? window.web3Instance.utils.toWei(data.ticketPrice.toString())
        : null,
      preSaleTicketPrice: data.preSaleTicketPrice || 0,
      location: data.location || null,
      registrationOpen: data.registrationOpen,
    };

    eventData = omitBy(eventData, isNil);
    setLoading(true);
    creatorContract.methods
      .createEvent(eventData)
      .send({ from: window.selectedAddress })
      .on('confirmation', async (confirmationNumber, receipt) => {
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

  const saveEventEdit = async (data) => {
    setLoading(true);
    
    loadEventContract(eventInfo.address)
    await window.eventContract.methods.changeEventInfo({
    description: data.description,
    link: data.link,
    registrationEnd: data.eventDates[0] ? data.eventDates[0].unix() : 0,
    start: data.eventDates[0].unix(),
    end: data.eventDates[1].unix(),
    ticketPrice: data.ticketPrice
    ? window.web3Instance.utils.toWei(data.ticketPrice.toString())
      : 0,
    maxParticipants: data.maxParticipants,
    onlyWhitelistRegistration: data.onlyWhitelistRegistration || false,
    preSaleTicketPrice: data.preSaleTicketPrice || 0,
    registrationOpen: data.registrationOpen,
    location: data.location
    }).send({ from: window.selectedAddress })
    .on('confirmation', async (confirmationNumber, receipt) => {
      if (confirmationNumber === 1) {
        setLoading(false);
        dispatch(setEventContract(window.eventContract));
        navigate(`/event/${eventInfo.address}`);
      }
    });
  }

  const onFinish = (data) => {
    createEvent(data);
  };

  const onFinishFailed = (errorInfo) => {
    setLoading(false);
    console.log('Failed:', errorInfo);
  };
  
  return (
    <Modal
      open={open}
      title={title} 
      onCancel={handleCancel}
      bodyStyle={{
        padding: 50,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      }}
      closable={false}
      footer={
        <div
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <Button
            form="event-register-form"
            type="primary"
            htmlType="submit"
            disabled={loading}
          >
            {actionTitle}
          </Button>
        </div>
      }
    >
      <Spin spinning={loading}>
        <Form
          layout="horizontal"
          autoComplete="off"
          id="event-register-form"
          onFinish={editEvent ? saveEventEdit : onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={eventInfo ? eventInfo : defaultEvent}
        >
          {!editEvent && <Form.Item
            label="Event name"
            name="name"
            rules={[{ required: true, message: 'Please input event name' }]}
          >
            <Input />
          </Form.Item>}
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          {!editEvent && <Form.Item
            label="Image"
            name="image"
            getValueFromEvent={updateImageUrl}
          >
            <FileUpload imageUrl={imageUrl} setImageUrl={updateImageUrl} />
          </Form.Item>}
          <Form.Item label="Link" name="link">
            <Input />
          </Form.Item>
          <Form.Item label="Location" name="location">
            <Input />
          </Form.Item>
          <Form.Item label="Max participants" name="maxParticipants">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Start and end event date" name="eventDates">
            <RangePicker format={dateFormat} />
          </Form.Item>
          <Form.Item label="Ticket price" name="ticketPrice">
            <InputNumber addonAfter="ETH" />
          </Form.Item>
          <Form.Item
            label="Registration Open"
            name="registrationOpen"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
