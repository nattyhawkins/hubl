import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import BlankCard from './BlankCard'

const GroupSet = ({ groups }) => {

  return (
    <Row className=' groups-row d-flex justify-content-center my-3'>
      {groups.map(group => {
        const { name, image, _id: groupId } = group
        return (
          <Col md='3' key={groupId} className='group-card my-2' >
            <Link className='text-decoration-none' to={`/${groupId}`}>
              <Card style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${image})` }}>
                <div className='group-name'>{name}</div>
              </Card>
            </Link>
          </Col>
        )
      })}
      <BlankCard />
    </Row>
  )
}

export default GroupSet