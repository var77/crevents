import React from 'react';
import { AttendEvent } from "./AttendEvent/AttendEvent";
import { EventRegistration } from "./EventRegistration/EventRegistration";
import { HomePage } from './HomePage/HomePage';
import {
    Routes,
    Route,
  } from "react-router-dom";

function Pages({ app }) {
    return (
        <Routes>
            <Route path="/" element={<HomePage app={app} />} />
            <Route path="/event/:address" element={<AttendEvent app={app} />} />
            <Route path="/event-registration" element={<EventRegistration app={app} />} />
        </Routes>
    );
}

export { Pages }