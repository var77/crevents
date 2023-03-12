import { Avatar, Card } from 'antd';
const { Meta } = Card;

export default function EventCard({ eventInfo, onAttendEvent, loading }) {
  return (
    <Card
      loading={loading}
      hoverable={!loading}
      title={eventInfo.name}
      style={{ width: 300, minHeight: 300 }}
      cover={<img alt={eventInfo.name} src={eventInfo.image} />}
      onClick={() => onAttendEvent(eventInfo.address)}
    >
      <Meta
        avatar={<Avatar src={eventInfo.organizerIcon} />}
        title={eventInfo.organizer}
        description={eventInfo.start}
      />
    </Card>
  );
}
