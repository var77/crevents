import React from 'react';
import { Routes, Route } from "react-router-dom";
import { AttendEvent } from "./AttendEvent/AttendEvent";
import { EventRegistration } from "./EventRegistration/EventRegistration";

function Pages({ app }) {
    return (
        <Routes>
            <Route path="/" element={<EventRegistration app={app} />} />
            <Route path="/event/:address" element={<AttendEvent app={app} />} />
            <Route path="/event-registration" element={<EventRegistration app={app} />} />
        </Routes>
    );
}

export { Pages }