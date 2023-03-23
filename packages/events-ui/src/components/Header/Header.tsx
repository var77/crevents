import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import EventsSlider from './EventsSlider';
import './Header.css';

export default function Header({isWalletConnected, onRegisterEvent, hideCreateEventBtn=false}) {
  const navigate = useNavigate();

  const redirectToHomePage = () => navigate('/');
  return (
    <div className="header">
      <div className='navbar-logo' onClick={redirectToHomePage}>
        Crevents
      </div>
      {!hideCreateEventBtn && <Button onClick={onRegisterEvent} className='navbar-btn'>
        {isWalletConnected ? "Create event" : "Log in"}
      </Button>}
    </div>
  );
}
