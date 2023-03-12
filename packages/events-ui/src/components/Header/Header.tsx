import React from 'react'
import { Button } from 'antd';
import EventsSlider from './EventsSlider';
import './Header.css';

export default function Header({ onRegisterEvent }) {
  return (
    <div className="header">
      <EventsSlider />
      <Button className='create-event-btn' onClick={onRegisterEvent}>Register Event</Button>
    </div>
  );
}
