import { FC, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { BigCCard } from '../components/Card';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

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

        return loaded ? (
            card ? (
                <>
                    <Navbar>
                        <Nav>
                            <Breadcrumbs />
                        </Nav>
                    </Navbar>
                    <BigCCard {...card} />
                </ >
            ) : (
                <h3 className='text-center'>Такого получателя не существует</h3>
            )
        ) : (
            <LoadAnimation/>
    )
}

export default CardInfo 