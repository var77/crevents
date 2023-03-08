import { Button } from 'antd';
import './Header.css';

export default function Header({ onRegisterEvent }) {
  return (
    <div className="header">
      <div className="page-header">Web3 Events</div>
      <Button onClick={onRegisterEvent}>Register Event</Button>
    </div>
  );
}
