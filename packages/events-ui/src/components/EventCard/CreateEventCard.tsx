import { Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function CreateEventCard({ onRegisterEvent }) {
  return (
    <Card
      hoverable
      title="Create Event"
      style={{ width: 300 }}
      bodyStyle={{
        height: 300,
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
