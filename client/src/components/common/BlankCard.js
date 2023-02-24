import { Card, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const BlankCard = () => {

  return (
    <Col md='3'className='group-card my-2' >
      <Link className='text-decoration-none' to={'/'}>
        <Card style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <div className='group-name'> ＋ </div>
        </Card>
      </Link>
    </Col>
  )
}

export default BlankCard