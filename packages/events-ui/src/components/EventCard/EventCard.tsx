import { Avatar, Button, Card } from 'antd';
const { Meta } = Card;

export default function EventCard({ eventInfo, onAttendEvent, loading, setOpenEventEditModal }) {
  const handleEditClick = (event) => {
    console.log(event, 'mtav');
    
    event.stopPropagation();
    setOpenEventEditModal(true);
  };
  return (
    <Card
      loading={loading}
      hoverable={!loading}
      title={eventInfo.name}
      className='event-card'
      style={{ 
        width: 300,
        minHeight: 300,
       }}
      cover={<img alt={eventInfo.name} src={eventInfo.image} />}
      onClick={() => onAttendEvent(eventInfo.address)}
      extra={<Button className='right-side' onClick={handleEditClick}>Edit</Button>}
    >
      <Meta
        avatar={<Avatar src={eventInfo.organizerIcon} />}
        title={eventInfo.organizer}
        description={eventInfo.start}
      />
    </Card>
  );
}
