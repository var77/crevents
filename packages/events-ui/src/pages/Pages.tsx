import React from 'react';
import { AttendEvent } from './AttendEvent/AttendEvent';
import { EventRegistration } from './EventRegistration/EventRegistration';
import { HomePage } from './HomePage/HomePage';
import { Routes, Route } from 'react-router-dom';

function Pages() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/event/:address" element={<AttendEvent />} />
      <Route path="/event-registration" element={<EventRegistration />} />
    </Routes>
  );
}

export { Pages };
