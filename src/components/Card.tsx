import { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom';
import {Card, ButtonGroup} from 'react-bootstrap';
import CardImage from './CardImage';
import { ICard } from '../models'

interface CardProps extends ICard {
    children: ReactNode;
}

const CardCard: FC<CardProps> = ({ children, uuid, name, type, image_url }) => (
    <Card className='card text-center rounded' key={uuid}>
        <CardImage url={image_url} className='rounded object-fit-cover'/>
        <Card.Body className='flex-grow-1'>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{type}</Card.Text>
        </Card.Body>
        <ButtonGroup vertical>
            <Link to={`/cards/${uuid}`} className="btn btn-primary" style={{ color: 'white',  fontWeight: 'bold'}}>О карте</Link>
            <>{children}</>
        </ButtonGroup>
    </Card>
);


export default CardCard;