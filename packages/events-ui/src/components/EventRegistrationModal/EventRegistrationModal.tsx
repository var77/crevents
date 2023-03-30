import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
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
import { loadEventContract, getGasPrice } from '../../utils/helpers';
import { selectCreatorContract } from '../../store/creatorContractSlice';
import { setEventContract } from '../../store/eventContractSlice';
import FileUpload from '../../components/FileUpload/FileUpload';

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const dateFormat = 'YYYY/MM/DD HH:mm';
const ONE_DAY = 1000 * 60 * 60 * 24;
const defaultEvent = {
  name: 'My first event',
  description: '',
  location: 'Online',
  link: '',
  maxParticipants: 0,
  registrationEnd: dayjs(Date.now() + ONE_DAY),
  eventDates: [dayjs(Date.now() + ONE_DAY), dayjs(Date.now() + ONE_DAY * 2)],
  ticketPrice: 0,
  preSaleTicketPrice: 0,
  registrationOpen: true,
};

export default function EventRegistrationModal({
  editEvent = false,
  handleCancel,
  eventInfo,
  open,
  title = 'Create event',
  actionTitle = 'Create event',
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const creatorContract = useSelector(selectCreatorContract);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateImageUrl = (url) => {
    setImageUrl(url);
    return url;
  };

  const createEvent = async (data) => {
    if (!creatorContract) {
      return;
    }
    let eventData = {
      name: data.name,
      description: data.description || '',
      link: data.link || '',
      image: imageUrl,
      maxParticipants: data.maxParticipants || 0,
      registrationEnd: data.eventDates[0] ? data.eventDates[0].unix() : 0,
      start: data.eventDates[0].unix(),
      end: data.eventDates[1].unix(),
      ticketPrice: data.ticketPrice
        ? window.web3Instance.utils.toWei(data.ticketPrice.toString())
        : 0,
      preSaleTicketPrice: data.preSaleTicketPrice || 0,
      location: data.location || null,
      registrationOpen: data.registrationOpen,
    };

    eventData = omitBy(eventData, isNil);
    setLoading(true);
    const gasInfo = await getGasPrice();
    creatorContract.methods
      .createEvent(eventData)
      .send({ from: window.selectedAddress, ...gasInfo })
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

    loadEventContract(eventInfo.address);
    const gasInfo = await getGasPrice();
    await window.eventContract.methods
      .changeEventInfo({
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
        location: data.location,
      })
      .send({ from: window.selectedAddress, ...gasInfo })
      .on('confirmation', async (confirmationNumber, receipt) => {
        if (confirmationNumber === 1) {
          setLoading(false);
          dispatch(setEventContract(window.eventContract));
          navigate(`/event/${eventInfo.address}`);
        }
      });
  };

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
            style={{
              backgroundColor: '#f3aa40',
              color: '#212025',
            }}
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
          {!editEvent && (
            <Form.Item
              label="Event name"
              name="name"
              rules={[{ required: true, message: 'Please input event name' }]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item label="Description" name="description">
            <TextArea
              placeholder="My event description"
              autoSize={{ minRows: 2, maxRows: 10 }}
            />
          </Form.Item>
          {!editEvent && (
            <Form.Item
              label="Image"
              name="image"
              getValueFromEvent={updateImageUrl}
              rules={[
                () => ({
                  validator() {
                    if (imageUrl) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Please upload an image for your event')
                    );
                  },
                }),
              ]}
            >
              <FileUpload imageUrl={imageUrl} setImageUrl={updateImageUrl} />
            </Form.Item>
          )}
          <Form.Item label="Link" name="link">
            <Input placeholder="https://example.com" />
          </Form.Item>
          <Form.Item label="Location" name="location">
            <Input placeholder="Blockchain!" />
          </Form.Item>
          <Form.Item label="Max participants" name="maxParticipants">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Start and end dates" name="eventDates">
            <RangePicker format={dateFormat} showTime />
          </Form.Item>
          <Form.Item label="Ticket price" name="ticketPrice">
            <InputNumber
              addonAfter={window.currency}
              placeholder="0.001"
              step={0.001}
            />
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
