import { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom';
import {Card, ButtonGroup} from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import CardImage from './CardImage';
import { ICard } from '../models'

interface CardProps extends ICard {
    children: ReactNode;
}
export const SmallCCard: FC<CardProps> = ({ children, uuid, name, type, image_url}) => (
    <Card className='card text-center' key={uuid}>
            <CardImage url={image_url} className='rounded object-fit-cover' />
        <Card.Body className='flex-grow-1'>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{type}</Card.Text>
        </Card.Body>
        <ButtonGroup vertical>
            <Link to={`/cards/${uuid}`} className="btn btn-primary">Подробнее</Link>
            <>{children}</>
        </ButtonGroup>
    </Card>
)

export const BigCCard: FC<ICard> = ({name,type, needfood,description, image_url}) => {
    return (
        <Card className='mx-auto shadow w-50 p-3 text-center text-md-start' >
             <div className='row'>
                <div className='col-12 col-md-8 px-md-0 overflow-hidden'>
                    {}
                    <CardImage url={image_url} />
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
};