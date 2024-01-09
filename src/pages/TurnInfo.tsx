import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Navbar, InputGroup, Form, Button, ButtonGroup } from 'react-bootstrap';

import { axiosAPI } from "../api";
import { getTurn } from '../api/Turns';
import { AppDispatch, RootState } from "../store";
import { ITurn, ICard } from "../models";
import { addToHistory } from "../store/historySlice";
import LoadAnimation from '../components/LoadAnimation';
import CardCard from '../components/Card';
import Breadcrumbs from '../components/Breadcrumbs';
import { MODERATOR } from '../components/AuthCheck';


const TurnInfo = () => {
    let { turn_id } = useParams()
    const [turn, setTurn] = useState<ITurn | null>(null)
    const [content, setContent] = useState<ICard[] | null>([])
    const role = useSelector((state: RootState) => state.user.role);
    const [loaded, setLoaded] = useState(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [edit, setEdit] = useState(false)
    const [turn_type, setNType] = useState<string>('')
    const navigate = useNavigate()

    const getData = () => {
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
            })
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
        setEdit(false);
    }

    useEffect(() => {
        dispatch(addToHistory({ path: location, name: "Ход" }))
        getData()
        setLoaded(true)

    }, [dispatch]);

    const delFromTurn = (id: string) => () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.delete(`/turns/delete_card/${id}`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => getData())
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
        }

        const moderator_confirm = (confirm: boolean) => () => {
            const accessToken = localStorage.getItem('access_token');
            axiosAPI.put(`/turns/${turn?.uuid}/moderator_confirm`,
                { confirm: confirm },
                { headers: { 'Authorization': `Bearer ${accessToken}`, } })
                .then(() => getData())
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
                                    <InputGroup.Text className='t-input-group-text' style={{ backgroundColor: 'orange', color: 'white', borderRadius: '30px', width: '300px'}}>Статус</InputGroup.Text>
                                    <Form.Control readOnly value={turn.status} style={{ backgroundColor: 'orange', color: 'white', borderRadius: '30px' }} />
                                </InputGroup>
                                <InputGroup className='mb-1'>
                                <InputGroup.Text className='t-input-group-text' style={{ backgroundColor: 'orange', color: 'white', borderRadius: '30px', width: '300px' }}>Создана</InputGroup.Text>
                                    <Form.Control readOnly value={turn.creation_date} style={{ backgroundColor: 'orange', color: 'white', borderRadius: '30px' }}/>
                                </InputGroup>
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text' style={{ backgroundColor: 'orange', color: 'white', borderRadius: '30px', width: '300px' }}>Сформирована</InputGroup.Text>
                                    <Form.Control readOnly value={turn.formation_date ? turn.formation_date : ''} style={{ backgroundColor: 'orange', color: 'white', borderRadius: '30px' }}/>
                                </InputGroup>
                                {(turn.status == 'отклонена' || turn.status == 'завершена') && <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text' style={{ backgroundColor: 'orange', color: 'white', borderRadius: '30px', width: '300px' }}>{turn.status === 'отклонена' ? 'Отклонена' : 'Завершена'} </InputGroup.Text>
                                    <Form.Control readOnly value={turn.completion_date ? turn.completion_date : ''} style={{ backgroundColor: 'orange', color: 'white', borderRadius: '30px'}}/>
                                </InputGroup>}
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text' style={{ backgroundColor: 'orange', color: 'white', borderRadius: '30px', width: '300px' }}>Взято еды</InputGroup.Text>
                                    <Form.Control
                                        readOnly={!edit}
                                        value={turn_type}
                                        onChange={(e) => setNType(e.target.value)}
                                        style={{ backgroundColor: 'orange', color: 'white', borderRadius: '30px'}}
                                    />
                                    {!edit && turn.status === 'черновик' && <Button onClick={() => setEdit(true)} style={{borderRadius: '30px'}}>Изменить</Button>}
                                    {edit && <Button variant='success' onClick={update} style={{borderRadius: '30px'}}>Сохранить</Button>}
                                    {edit && <Button
                                        variant='danger'
                                        onClick={() => {
                                            setNType(turn.takefood ? turn.takefood : '');
                                            setEdit(false)
                                        }}
                                        style={{borderRadius: '30px'}}>
                                        Отменить
                                    </Button>}
                                </InputGroup>
                                {turn.status != 'черновик' &&
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text className='t-input-group-text'>Статус отправки</InputGroup.Text>
                                        <Form.Control readOnly value={turn.sending_status ? turn.sending_status : ''} />
                                        </InputGroup>
                                }
                                {turn.status == 'сформировано' && role == MODERATOR &&
                                    <ButtonGroup className='flex-grow-1 w-100'>
                                        <Button variant='primary' onClick={moderator_confirm(true)}>Подтвердить</Button>
                                        <Button variant='danger' onClick={moderator_confirm(false)}>Отменить</Button>
                                    </ButtonGroup>
                                }
                                {turn.status == 'черновик' &&
                                    <div className='flex-grow-1 w-100'>
                                    <Button variant='success' onClick={confirm} style={{borderRadius: '30px'}}>Сформировать</Button>
                                    <Button variant='danger' onClick={deleteN} style={{borderRadius: '30px'}}>Удалить</Button>
                                </div>}
                            </Card.Body>
                        </Card>
                        {content && <Row className='row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1 mt-2'>
                            {content.map((card) => (
                                <div className='d-flex p-2 justify-content-center' key={card.uuid}>
                                    <CardCard  {...card}>
                                        {turn.status == 'черновик' &&
                                            <Button
                                                variant='outline-danger'
                                                className='mt-0 rounded-bottom'
                                                onClick={delFromTurn(card.uuid)}>
                                                Удалить
                                            </Button>}
                                    </CardCard>
                                </div>
                            ))}
                        </Row>}
                    </Col>
                </>
            ) : (
                <h4 className='text-center'>Такого хода не существует</h4>
            )}
        </LoadAnimation>
    )
}

export default TurnInfo