import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import { axiosAPI } from '../api';
import { AxiosError } from 'axios';

const Registration: FC = () => {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleRegistration = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axiosAPI
      .post('/user/sign_up', { login, password })
      .then(() => {
        navigate('/authorization');
      })
      .catch((error: AxiosError) => {
        console.error('Error:', error.message);
      });
  };

  return (
    <Card className='mx-auto shadow w-50 p-3 text-center text-md-start' border="primary">
      <Container fluid="sm" className='d-flex flex-column flex-grow-1 align-items-center justify-content-center'>
        <Form onSubmit={handleRegistration} className='d-flex flex-column align-items-center'>
          <h2>Регистрация</h2>

          <Form.Group controlId="login" className='d-flex flex-column align-items-center mt-2'>
            <Form.Label>Логин<Form.Control
              type="text"
              placeholder="Введите ваш логин"
              value={login}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
            />
            </Form.Label>
          </Form.Group>

          <Form.Group controlId="password" className='d-flex flex-column align-items-center mt-1'>
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введите ваш пароль"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className='mt-3 w-100'
            disabled={!login || !password}
          >
            Зарегистрироваться
          </Button>

          <Form.Group>
            <Form.Text>Уже есть аккаунт? </Form.Text>
            <Link to={'/authorization'}>
              Перейти к авторизации
            </Link>
          </Form.Group>
        </Form>
      </Container>
    </Card>
  );
};

export default Registration;
