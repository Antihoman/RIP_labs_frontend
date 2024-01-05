import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BigCCard, ICardProps } from '../components/Card';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import LoadAnimation from '../components/LoadAnimation';
import { getCard } from '../requests/GetCard'

const CardInfo: FC = () => {
    let { card_id } = useParams()
    const [card, setCard] = useState<ICardProps>()
    const [loaded, setLoaded] = useState<boolean>(false)

    useEffect(() => {
        getCard(card_id)
            .then(data => {
                setCard(data)
                setLoaded(true)
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <>
            <Navbar>
                <Nav>
                    <Link to="/card" className="nav-link p-0 text-dark" data-bs-theme="dark">
                        Карты
                    </Link>
                    <Nav.Item className='mx-1'>{">"}</Nav.Item>
                    <Nav.Item className="nav-link p-0 text-dark">
                        {`${card ? card.name : 'неизвестно'}`}
                    </Nav.Item>
                </Nav>
            </Navbar>
            {loaded ? (
                card ? (
                    <BigCCard {...card} />
                ) : (
                    <h3 className='text-center'>Такой карты не существует</h3>
                )
            ) : (
                <LoadAnimation />
            )
            }
        </ >
    )
}

export { CardInfo }