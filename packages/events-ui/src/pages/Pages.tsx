import { AttendEvent } from './AttendEvent/AttendEvent';
import { HomePage } from './HomePage/HomePage';
import { Routes, Route } from 'react-router-dom';

function Pages() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/event/:address" element={<AttendEvent />} />
    </Routes>
  );
}

export { Pages };
