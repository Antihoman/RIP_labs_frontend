import { useEffect, useState } from 'react';
import { Navbar, Form, Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';

import { getAllCards, axiosAPI } from '../api'
import { ICard } from '../models'

import { AppDispatch, RootState } from "../store";
import { setName } from "../store/searchSlice"
import { clearHistory, addToHistory } from "../store/historySlice"

import LoadAnimation from '../components/LoadAnimation';
import CardImage from '../components/CardImage';


const CardTable = () => {
    const searchText = useSelector((state: RootState) => state.search.name);
    const [cards, setCards] = useState<ICard[]>([])
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;

    const getCards = () =>
        getAllCards(searchText)
            .then(data => {
                setCards(data.cards)
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });


    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        setCards([])
        getCards();
    }

    useEffect(() => {
        dispatch(clearHistory())
        dispatch(addToHistory({ path: location, name: "Управление картой" }))
        getCards();
    }, [dispatch]);

    const deleteCard = (uuid: string) => () => {
        let accessToken = localStorage.getItem('access_token');
        axiosAPI.delete(`/cards/${uuid}`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => getCards())
    }
    return (
        <>
            <Navbar>
                <Form className="d-flex flex-row flex-grow-1 gap-1" onSubmit={handleSearch}>
                    <Form.Control
                        type="text"
                        placeholder="Поиск"
                        className="form-control-sm flex-grow-1 shadow"
                        data-bs-theme="primary"
                        value={searchText}
                        onChange={(e) => dispatch(setName(e.target.value))}
                    />
                    <Button
                        variant="primary"
                        size="sm"
                        type="submit"
                        className="shadow-lg">
                        Поиск
                    </Button>
                    <Link to='new' className='btn btn-sm btn-warning shadow ms-sm-2'>Добавить карту</Link>
                </Form>
            </Navbar>
            < LoadAnimation loaded={cards.length > 0}>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>Изображение</th>
                            <th className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>Название</th>
                            <th className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>Описание</th>
                            <th className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>Тип</th>
                            <th className='text-center text-nowrap' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>Нужно еды</th>
                            <th className=''></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cards.map((card) => (
                            <tr key={card.uuid}>
                                <td style={{ width: '15%' }} className='p-0'>
                                    <CardImage url={card.image_url} />
                                </td>
                                <td className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>{card.name}</td>
                                <td className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>{card.description}</td>
                                <td className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>{card.type}</td>
                                <td className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>{card.needfood}</td>
                                <td className='text-center align-middle p-0' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>
                                <Table className='m-0'>
                                        <tbody>
                                            <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <Link
                                                        to={`/cards-edit/${card.uuid}`}
                                                        className='btn btn-sm btn-outline-primary text-decoration-none w-100' style={{ backgroundColor: 'white', color: 'orange', borderRadius: '10px', borderColor: 'orange'}} >
                                                        Изменить
                                                    </Link>
                                                </td>
                                            </tr>
                                            <tr >
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <Button
                                                        variant='outline-danger'
                                                        size='sm'
                                                        className='w-100' style={{ backgroundColor: 'white', color: 'red', borderRadius: '10px' }}
                                                        onClick={deleteCard(card.uuid)}>
                                                        Удалить
                                                    </Button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </LoadAnimation >
        </>
    )
}

export default CardTable