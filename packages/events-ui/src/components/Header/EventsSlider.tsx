import React from 'react';
import { Carousel } from 'antd';
import './Header.css';

const contentStyle: React.CSSProperties = {
  height: '300px',
  color: '#fff',
  lineHeight: '300px',
  textAlign: 'center',
  background: '#364d79',
  margin: 0,
  fontSize: 90,
  fontFamily: "'Noto Sans Bassa Vah', sans-serif"
};

const EventsSlider: React.FC = () => (
  <Carousel className="slider" autoplay>
    <div>
      <h3 style={contentStyle}>Crevents</h3>
    </div>
  </Carousel>
);

export default EventsSlider;
