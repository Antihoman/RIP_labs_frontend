import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Navbar, InputGroup, Form, Button, ButtonGroup } from 'react-bootstrap';

import { axiosAPI } from "../api";
import { getTurn } from '../api/Turns';
import { AppDispatch } from "../store";
import { ITurn, ICard } from "../models";
import { addToHistory } from "../store/historySlice";
import LoadAnimation from '../components/LoadAnimation';
import { SmallCCard } from '../components/Card';
import Breadcrumbs from '../components/Breadcrumbs';


const TurnInfo = () => {
    let { turn_id } = useParams()
    const [turn, setTurn] = useState<ITurn | null>(null)
    const [content, setContent] = useState<ICard[] | null>([])
    const [loaded, setLoaded] = useState(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [edit, setEdit] = useState(false)
    const [turn_type, setNType] = useState<string>('')
    const navigate = useNavigate()

    const getData = () => {
        setLoaded(false)
        getTurn(turn_id)
            .then(data => {
                if (data === null) {
                    setTurn(null)
                    setContent([])
                } else {
                    setTurn(data.turn);
                    setNType(data.turn.takefood ? data.turn.takefood : '')
                    setContent(data.cards);

                }
                setLoaded(true)
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoaded(true)
            });
        setLoaded(true)
    }

    const update = () => {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.put(`/turns`,
            { turn_phase: turn_type },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            })
            .then(() => getData())
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        setEdit(false);
    }

    useEffect(() => {
        getData()
        dispatch(addToHistory({ path: location, name: "Карты" }))

    }, [dispatch]);

    const delFromTurn = (id: string) => () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.delete(`/turns/delete_card/${id}`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => getData())
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const confirm = () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.put('/turns/user_confirm', null, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(_ => {
                getData()
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const deleteN = () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.delete('/turns', { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(_ => {
                navigate('/cards')
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    console.log(turn)

    return (
        <LoadAnimation loaded={loaded}>
            {turn ? (
                <>
                    <Navbar>
                            <Breadcrumbs />
                    </Navbar>
                    <Col className='p-3 pt-1'>
                        <Card className='shadow text center text-md-start'>
                            <Card.Body>
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Статус</InputGroup.Text>
                                    <Form.Control readOnly value={turn.status} />
                                </InputGroup>
                                <InputGroup className='mb-1'>
                                <InputGroup.Text className='t-input-group-text'>Создана</InputGroup.Text>
                                    <Form.Control readOnly value={turn.creation_date} />
                                </InputGroup>
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Сформирована</InputGroup.Text>
                                    <Form.Control readOnly value={turn.formation_date ? turn.formation_date : ''} />
                                </InputGroup>
                                {(turn.status == 'отклонена' || turn.status == 'завершена') && <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>{turn.status === 'отклонена' ? 'Отклонена' : 'Подтверждена'}</InputGroup.Text>
                                    <Form.Control readOnly value={turn.completion_date ? turn.completion_date : ''} />
                                </InputGroup>}
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Взято еды</InputGroup.Text>
                                    <Form.Control
                                        readOnly={!edit}
                                        value={turn_type}
                                        onChange={(e) => setNType(e.target.value)}
                                    />
                                    {!edit && turn.status === 'черновик' && <Button onClick={() => setEdit(true)}>Изменить</Button>}
                                    {edit && <Button variant='success' onClick={update}>Сохранить</Button>}
                                    {edit && <Button
                                        variant='danger'
                                        onClick={() => {
                                            setNType(turn.takefood ? turn.takefood : '');
                                            setEdit(false)
                                        }}>
                                        Отменить
                                    </Button>}
                                </InputGroup>
                                {turn.status != 'черновик' &&
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text className='t-input-group-text'>Статус отправки</InputGroup.Text>
                                        <Form.Control readOnly value={turn.sending_status ? turn.sending_status : ''} />
                                    </InputGroup>}
                                {turn.status == 'черновик' &&
                                    <ButtonGroup className='flex-grow-1 w-100'>
                                        <Button variant='primary' onClick={confirm}>Сформировать</Button>
                                        <Button variant='danger' onClick={deleteN}>Удалить</Button>
                                    </ButtonGroup>}
                            </Card.Body>
                        </Card>
                        {content && <Row className='row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1 mt-2'>
                            {content.map((card) => (
                                <div className='d-flex p-2 justify-content-center' key={card.uuid}>
                                    <SmallCCard  {...card}>
                                        {turn.status == 'черновик' &&
                                            <Button
                                                variant='outline-danger'
                                                className='mt-0 rounded-bottom'
                                                onClick={delFromTurn(card.uuid)}>
                                                Удалить
                                            </Button>}
                                    </SmallCCard>
                                </div>
                            ))}
                        </Row>}
                    </Col>
                </>
            ) : (
                <h4 className='text-center'>Такой карты не существует</h4>
            )}
        </LoadAnimation>
    )
}

export default TurnInfo