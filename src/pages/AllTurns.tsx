import { AppDispatch, RootState } from "../store";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getTurns } from '../api/Turns';
import LoadAnimation from '../components/LoadAnimation';
import { setUser, setStatus, setDateStart, setDateEnd } from "../store/searchSlice";
import { ITurn } from "../models";

import { axiosAPI } from '../api';
import { MODERATOR } from '../components/AuthCheck'
import { useLocation, Link } from 'react-router-dom';
import { Navbar, Form, Button, Table, InputGroup, ButtonGroup } from 'react-bootstrap';
import { clearHistory, addToHistory } from "../store/historySlice";
import "react-datepicker/dist/react-datepicker.css"

import DateTimePicker from '../components/DatePicker';

const AllTurns = () => {
    const [turns, setTurns] = useState<ITurn[]>([])
    const userFilter = useSelector((state: RootState) => state.search.user);
    const statusFilter = useSelector((state: RootState) => state.search.status);
    const startDate = useSelector((state: RootState) => state.search.formationDateStart);
    const endDate = useSelector((state: RootState) => state.search.formationDateEnd);
    const role = useSelector((state: RootState) => state.user.role);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [loaded, setLoaded] = useState(false)

    const getData = () => {
        getTurns(userFilter, statusFilter, startDate, endDate)
            .then((data) => {
                setLoaded(true);
                setTurns(data)
            })
        };
    
        const handleSearch = (event: React.FormEvent<any>) => {
            event.preventDefault();
    }

    useEffect(() => {
        dispatch(clearHistory())
        dispatch(addToHistory({ path: location, name: "Ходы" }))
        getData()
        const intervalId = setInterval(() => {
            getData();
        }, 8000);
        return () => clearInterval(intervalId);
    }, [dispatch, userFilter, statusFilter, startDate, endDate]);

    const moderator_confirm = (id: string, confirm: boolean) => () => {
        const accessToken = localStorage.getItem('access_token');
        axiosAPI.put(`/turns/${id}/moderator_confirm`,
            { confirm: confirm },
            { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => setTurns(prevTurns => [...prevTurns]))
    }

    return (
        <>
            <Navbar>
                <Form className="d-flex flex-row align-items-stretch flex-grow-1 gap-2" onSubmit={handleSearch}>
                {role == MODERATOR && <InputGroup size='sm' className='shadow-sm'>
                        <InputGroup.Text>Пользователь</InputGroup.Text>
                        <Form.Control value={userFilter} onChange={(e) => dispatch(setUser(e.target.value))} />
                    </InputGroup>}
                <InputGroup size='sm' className='shadow-sm'>
                        <InputGroup.Text >Статус</InputGroup.Text>
                        <Form.Select
                            defaultValue={statusFilter}
                            onChange={(status) => dispatch(setStatus(status.target.value))}
                        >
                            <option value="">Любой</option>
                            <option value="сформирован">Сформирован</option>
                            <option value="завершен">Завершен</option>
                            <option value="отклонен">Отклонен</option>
                        </Form.Select>
                    </InputGroup>
                    <DateTimePicker
                        selected={startDate ? new Date(startDate) : null}
                        onChange={(date: Date) => dispatch(setDateStart(date ? date.toISOString() : null))}
                    />
                    <DateTimePicker
                        selected={endDate ? new Date(endDate) : null}
                        onChange={(date: Date) => dispatch(setDateEnd(date ? date.toISOString() : null))}
                    />
                </Form>
            </Navbar>
            < LoadAnimation loaded={loaded}>
                <Table bordered hover>
                    <thead>
                        <tr>
                            {role == MODERATOR && <th className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>Создатель</th>}
                            <th className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>Статус</th>
                            <th className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>Статус отправки</th>
                            <th className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>Дата создания</th>
                            <th className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>Дата формирования</th>
                            <th className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>Дата завершения</th>
                            <th className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>Взято еды</th>
                            <th className='text-center'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {turns.map((turn) => (
                            <tr key={turn.uuid}>
                                {role == MODERATOR && <td className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>{turn.customer}</td>}
                                <td className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>{turn.status}</td>
                                <td className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>{turn.sending_status}</td>
                                <td className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>{turn.creation_date}</td>
                                <td className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>{turn.formation_date}</td>
                                <td className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>{turn.completion_date}</td>
                                <td className='text-center' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>{turn.takefood}</td>
                                <td className='p-0 text-center align-middle' style={{ backgroundColor: 'white', color: '#0b5ed7', borderRadius: '10px' }}>
                                    <Table className='m-0'>
                                        <tbody>
                                            <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <Link to={`/turns/${turn.uuid}`}
                                                        className='btn btn-sm btn-outline-primary text-decoration-none w-100' style={{ backgroundColor: 'white', borderRadius: '10px'}}  >
                                                        О ходе
                                                    </Link>
                                                </td>
                                            </tr>
                                            {turn.status == 'сформирован' && role == MODERATOR && <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                <ButtonGroup className='flex-grow-1 w-100'>
                                                    <Button variant='success' size='sm' onClick={moderator_confirm(turn.uuid, true)} style={{ backgroundColor: 'white', color: 'green', borderRadius: '10px' }}>Подтвердить</Button>
                                                    <Button variant='danger' size='sm' onClick={moderator_confirm(turn.uuid, false)} style={{ backgroundColor: 'white', color: 'red', borderRadius: '10px' }}>Отменить</Button>
                                                </ButtonGroup>
                                                </td>
                                            </tr>}
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

export default AllTurns 