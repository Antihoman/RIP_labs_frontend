import { FC, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import CardImage from '../components/CardImage';
import { Card, Row, Navbar, ListGroup } from 'react-bootstrap';
import LoadAnimation from '../components/LoadAnimation';

import { getCard } from '../api'
import { ICard } from '../models';

import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { addToHistory } from "../store/historySlice"
import Breadcrumbs from '../components/Breadcrumbs';

const CardInfo: FC = () => {
    let { card_id } = useParams()
    const [card, setCard] = useState<ICard | undefined>(undefined)
    const [loaded, setLoaded] = useState<boolean>(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;

    console.log()

    useEffect(() => {
        getCard(card_id)
            .then(data => {
                setCard(data);
                dispatch(addToHistory({ path: location, name: data ? data.name : "неизвестно" }));
                setLoaded(true);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        }, [dispatch]);

        return (
            <LoadAnimation loaded={loaded}>
                {card ? (
                    <>
                        <Navbar>
                            <Breadcrumbs />
                            </Navbar>
                    <Card className='mx-auto shadow w-50 p-3 text-center text-md-start'>
                        <Row>
                            <div className='col-12 col-md-8 overflow-hidden text-center'>
                                <CardImage url={card.image_url} />
                                <Card.Title>{card.name}</Card.Title>
                            </div>
                            <Card.Body className='col-12 col-md-4 ps-md-0'>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Card.Text>Тип: {card.type}</Card.Text>
                                        <Card.Text>Нужно еды: {card.needfood}</Card.Text>
                                        <Card.Text>Описание: {card.description}</Card.Text>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Row>
                    </Card>
                </ >
            ) : (
                <h3 className='text-center'>Такой карты не существует</h3>
            )}
        </LoadAnimation>
    )
}

export default CardInfo 