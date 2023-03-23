import { Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function CreateEventCard({ onRegisterEvent }) {
  return (
    <Card
      hoverable
      style={{ width: 300, margin: '32px 0px' }}
      bodyStyle={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
      }}
      onClick={onRegisterEvent}
    >
      <PlusOutlined style={{ fontSize: '60px' }} />
    </Card>
  );
}
