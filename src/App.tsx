import './App.css'
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { AllCards, CardsTable, CardInfo, CardEdit, AllTurns, TurnInfo, Authorization, Registration } from './pages'
import NavigationBar from './components/NavBar';

import { AppDispatch } from "./store";
import { setLogin, setRole } from "./store/userSlice";
import AuthCheck, { CUSTOMER, MODERATOR } from './components/AuthCheck'

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const login = localStorage.getItem('login');
    const role = localStorage.getItem('role');
    if (login && role) {
      dispatch(setLogin(login));
      dispatch(setRole(parseInt(role)));
    }
  }, [dispatch]);
  
  return (
    <div className='d-flex flex-column vh-100'>
      <div className='container-xl d-flex flex-column px-2 px-sm-3 flex-grow-1'>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Navigate to="/cards" />} />
        <Route path="/cards" element={<AllCards />} />
        <Route path="/cards/:card_id" element={<CardInfo />} />
        <Route path="/cards-edit" element={<AuthCheck allowedRoles={[MODERATOR]}><CardsTable /></AuthCheck>} />
        <Route path="/cards-edit/:card_id" element={<AuthCheck allowedRoles={[MODERATOR]}><CardEdit /></AuthCheck>} />
        <Route path="/turns" element={<AuthCheck allowedRoles={[CUSTOMER, MODERATOR]}><AllTurns /></AuthCheck>} />
        <Route path="/turns/:turn_id" element={<AuthCheck allowedRoles={[CUSTOMER, MODERATOR]}><TurnInfo /></AuthCheck>} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/authorization" element={<Authorization />} />
      </Routes>
      </div>
    </div>
  )
}

export default App