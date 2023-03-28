import { Button } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import EventsSlider from './EventsSlider';
import './Header.css';

export default function Header({
  isWalletConnected,
  onRegisterEvent,
  hideCreateEventBtn = false,
}) {
  const navigate = useNavigate();

  const redirectToHomePage = () => navigate('/');
  const redirectToVerifyPage = () => navigate('/verify-ticket');
  const openGithub = () => window.open('https://github.com/var77/crevents');

  return (
    <div className="header">
      <div className="navbar-logo" onClick={redirectToHomePage}>
        Crevents
      </div>
      <div className='button-container'>
        {!hideCreateEventBtn && (
          <Button onClick={onRegisterEvent} className="navbar-btn">
            {isWalletConnected ? 'Create event' : 'Log in'}
          </Button>
        )}
        {!hideCreateEventBtn && (
          <Button onClick={redirectToVerifyPage} className="navbar-btn">
            Verify Ticket
          </Button>
        )}
        <GithubOutlined onClick={openGithub} className='github-icon' />
      </div>
    </div>
  );
}
