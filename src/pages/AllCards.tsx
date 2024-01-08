import { useEffect, useState } from 'react';
import { SmallCCard } from '../components/Card';
import LoadAnimation from '../components/LoadAnimation';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';

import { getAllCards, axiosAPI } from '../api'
import { AppDispatch, RootState } from "../store";
import { setName } from "../store/searchSlice"
import { clearHistory, addToHistory } from "../store/historySlice"
import { ICard } from '../models'

const AllCards = () => {
    const searchText = useSelector((state: RootState) => state.search.name);
    const [cards, setCards] = useState<ICard[]>([])
    const [draft, setDraft] = useState<string | null>(null)
    const role = useSelector((state: RootState) => state.user.role);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;

    const getCards = () =>
            getAllCards(searchText)
                .then(data => {
                    setCards(data.cards)
                    setDraft(data.draft_turn)
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });

                const handleSearch = (event: React.FormEvent<any>) => {
                    event.preventDefault();
                    getCards();
                }
            
                useEffect(() => {
                    dispatch(clearHistory())
                    dispatch(addToHistory({ path: location, name: "Карты" }))
                    getCards();
                }, [dispatch]);   
                
                const addToTurn = (id: string) => () => {
                    let accessToken = localStorage.getItem('access_token');
                    if (!accessToken) {
                        return
                    }
            
                    axiosAPI.post(`/cards/${id}/add_to_turn`, null, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
                        .then(() => {
                            getCards();
                        })
                        .catch((error) => {
                            console.error("Error fetching data:", error);
                        });
                }
    return (
        <>
             <Navbar>
                <Form className="d-flex flex-row flex-grow-1 gap-2" onSubmit={handleSearch}>
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
                </Form>
            </Navbar>
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1'>
            <LoadAnimation loaded={cards.length > 0}>
                    {cards.map((card) => (
                    <div className='d-flex py-1 p-2 justify-content-center' key={card.uuid}>
                        <SmallCCard  {...card}>
                                {role != 0 &&
                                    <Button
                                        variant='outline-primary'
                                        className='mt-0 rounded-bottom'
                                        onClick={addToTurn(card.uuid)}>
                                        Добавить в корзину
                                    </Button>
                                }
                            </SmallCCard>
                    </div>
                ))}
                </LoadAnimation>
        </div>
        {!!role && <Link to={`/turns/${draft}`}>
                <Button
                    style={{ position: 'fixed', bottom: '16px', left: '16px', zIndex: '1000' }}
                    className="btn btn-primary"
                    disabled={!draft}>
                    Корзина
                </Button>
            </Link>}
        </>
    )
}

export default AllCards