import { Avatar, Button, Card } from 'antd';
const { Meta } = Card;

export default function EventCard({ eventInfo, setEventInfo, onAttendEvent, loading, setOpenEventEditModal, }) {
  const handleEditClick = (e, eventInfo) => {
    setEventInfo(eventInfo)  
    e.stopPropagation();
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
        height: loading && 'fit-content',
        minHeight: 418,
        margin: 'auto'

       }}
      cover={<img alt={eventInfo.name} src={eventInfo.image} />}
      onClick={() => onAttendEvent(eventInfo.address)}
      extra={ eventInfo.organizer === window.selectedAddress && <Button className='right-side' onClick={(e) => handleEditClick(e, eventInfo)}>Edit</Button>}
    >
      <Meta
        avatar={<Avatar src={eventInfo.organizerIcon} />}
        title={eventInfo.organizer}
        description={eventInfo.start}
      />
    </Card>
  );
}
