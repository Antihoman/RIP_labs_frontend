import { FC, useEffect, useState, ChangeEvent, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { Card, Row, Navbar, FloatingLabel, InputGroup, Form, Col, Button, ButtonGroup } from 'react-bootstrap';

import { axiosAPI, getCard } from '../api'
import { ICard } from '../models';

import { AppDispatch } from "../store";
import { addToHistory } from "../store/historySlice"

import LoadAnimation from '../components/LoadAnimation';
import CardImage from '../components/CardImage';
import Breadcrumbs from '../components/Breadcrumbs';

const CardInfo: FC = () => {
    let { card_id } = useParams()
    const [card, setCard] = useState<ICard | undefined>(undefined)
    const [loaded, setLoaded] = useState<Boolean>(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [edit, setEdit] = useState<boolean>(true)
    const [image, setImage] = useState<File | undefined>(undefined);
    const inputFile = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate()

    useEffect(() => {
        const getData = async () => {
            setLoaded(false);
            let data: ICard | undefined;
            let name: string;
            try {
                if (card_id == 'new') {
                    data = {
                        uuid: "",
                        name: "",
                        type: "",
                        needfood: NaN,
                        image_url: "",
                        description: "",
                    }
                    name = 'Новая карта'
                    setEdit(true)
                } else {
                    data = await getCard(card_id);
                    name = data ? data.name : ''
                }
                setCard(data);
                dispatch(addToHistory({ path: location, name: name }));
            } finally {
                setLoaded(true);
            }
        }

        getData();
}, [dispatch]);

    const changeString = (e: ChangeEvent<HTMLInputElement>) => {
        setCard(card ? { ...card, [e.target.id]: e.target.value } : undefined)
    }

    const changeNumber = (e: ChangeEvent<HTMLInputElement>) => {
        setCard(card ? { ...card, [e.target.id]: parseInt(e.target.value) } : undefined)
    }

    const deleteCard = () => {
        let accessToken = localStorage.getItem('access_token');
        axiosAPI.delete(`/cards/${card_id}`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => navigate('/cards-edit'))
    }

    const save = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formElement = event.currentTarget;
        if (!formElement.checkValidity()) {
            return
        }
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        setEdit(false);
        const formData = new FormData();
        if (card) {
            Object.keys(card).forEach(key => {
                if ((card as any)[key]) {
                    formData.append(key, (card as any)[key])
                }
            });
        }
        if (image) {
            formData.append('image', image);
        }

        if (card_id == 'new') {
            axiosAPI.post(`/cards`, formData, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
                .then((response) => getCard(response.data).then((data) => setCard(data)))
        } else {
            axiosAPI.put(`/cards/${card?.uuid}`, formData, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
                .then(() => getCard(card_id).then((data) => setCard(data)))
        }
    }

    const cancel = () => {
        setEdit(false)
        setImage(undefined)
        if (inputFile.current) {
            inputFile.current.value = ''
        }
        getCard(card_id)
            .then((data) => setCard(data))
    }

    const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setEdit(true)
    }

    return (
        <LoadAnimation loaded={loaded}>
        {card ? (
            <>
                <Navbar>
                    <Breadcrumbs />
                </Navbar>
                <Card className='shadow mb-1'>
                    <Row className='m-0'>
                        <Col className='col-12 col-md-8 overflow-hidden p-0'>
                            <CardImage url={card.image_url} />
                        </Col>
                        <Col className='d-flex flex-column col-12 col-md-4 p-0'>
                            <Form noValidate validated={edit} onSubmit={save}>
                                <Card.Body className='flex-grow-1'>
                                    <InputGroup hasValidation className='mb-1'>
                                        <InputGroup.Text className='c-input-group-text'>Название</InputGroup.Text>
                                        <Form.Control id='name' required type='text' value={card.name} readOnly={!edit} onChange={changeString} />
                                    </InputGroup>
                                    <FloatingLabel
                                        label="Описание"
                                        className="mb-3">
                                        <Form.Control
                                            id='description'
                                            value={card.description}
                                            as="textarea"
                                            className='h-25'
                                            readOnly={!edit}
                                            required
                                            onChange={changeString} />
                                    </FloatingLabel>
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text className='c-input-group-text'>Нужно еды</InputGroup.Text>
                                        <Form.Control id='needfood' required type='number' value={isNaN(card.needfood) ? '' : card.needfood} readOnly={!edit} onChange={changeNumber} />
                                    </InputGroup>
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text className='c-input-group-text'>Тип</InputGroup.Text>
                                        <Form.Control id='type' required value={card.type} readOnly={!edit} onChange={changeString} />
                                    </InputGroup>
                                    <Form.Group className="mb-1">
                                        <Form.Label>Выберите новое изображение</Form.Label>
                                        <Form.Control
                                            disabled={!edit}
                                            type="file"
                                            accept='image/*'
                                            ref={inputFile}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setImage(e.target.files?.[0])} />
                                    </Form.Group>
                                </Card.Body>
                                    {edit ? (
                                        <ButtonGroup className='w-100'>
                                            <Button style={{ backgroundColor: 'white', color: 'green', borderRadius: '10px', borderColor: 'green'}} type='submit'>Сохранить</Button>
                                            {card_id != 'new' && <Button style={{ backgroundColor: 'white', color: 'red', borderRadius: '10px', borderColor: 'red' }} onClick={cancel}>Отменить</Button>}
                                        </ButtonGroup>
                                    ) : (
                                        <>
                                            <Button
                                                className='w-100' style={{ backgroundColor: 'white', color: 'orange', borderRadius: '10px', borderColor: 'orange'}}
                                                onClick={handleEditClick}>
                                                Изменить
                                            </Button>
                                            <Button className='w-100' style={{ backgroundColor: 'white', color: 'red', borderRadius: '10px', borderColor: 'red' }} onClick={deleteCard}>Удалить</Button>
                                        </>
                                    )}
                                </Form>
                            </Col>
                        </Row>
                </Card>
            </ >
        ) : (
            <h3 className='text-center'>Такой карты не существует</h3>
        )}
    </LoadAnimation >
    )
}

export default CardInfo