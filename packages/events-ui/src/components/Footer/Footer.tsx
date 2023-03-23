import { Footer } from 'antd/es/layout/layout';
import './Footer.css';

export default function FooterComponent() {
  return (
    <Footer style={{ 
      backgroundColor: 'transparent',
      color: 'white',
      fontWeight: 700,
  }}>
    <div className="footer">
      <div>C 2023 Crevents</div>
    </div>
    </Footer>
  );
}
