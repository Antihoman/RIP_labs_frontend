import { FC } from 'react'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import CardImage from './CardImage';

export interface ICardProps {
    uuid: string
    name: string
    type: string
    needfood: number
    description: string
    image_url: string
}

export const SmallCCard: FC<ICardProps> = ({ uuid, name, type, image_url }) => (
    <Card className='w-100 mx-auto px-0 shadow text-center'>
        <div className="ratio ratio-16x9 overflow-hidden">
            <CardImage url={image_url} className='rounded object-fit-cover'/>
        </div>
        <Card.Body className='flex-grow-1'>
            <Card.Title>{name}</Card.Title>
            <Card.Text>Тип: {type}</Card.Text>
        </Card.Body>
        <Link to={`/cards/${uuid}`} className="btn btn-primary" style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px', borderColor: '#0b5ed7'}}>Подробнее</Link>
    </Card>
)

export const BigCCard: FC<ICardProps> = ({ name, type, image_url, description, needfood }) => (
    <Card className='shadow text-center text-md-start'>
        <div className='row'>
            <div className='col-12 col-md-8 overflow-hidden'>{}
                <CardImage url={image_url}/>
            </div>
            <Card.Body className='col-12 col-md-4 ps-md-0'>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Card.Title>{name}</Card.Title>
                        <Card.Text>Нужно еды: {needfood}</Card.Text>
                        <Card.Text>Тип: {type}</Card.Text>
                        <Card.Text>Описание: {description}</Card.Text>
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </div>
    </Card>
);