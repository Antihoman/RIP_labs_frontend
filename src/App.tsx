import { Routes, Route, Navigate } from 'react-router-dom';
import { AllCards } from './pages/AllCards'
import { CardInfo } from './pages/CardInfo'
import { AllTurns } from './pages/AllTurns'
import NavigationBar from './components/NavBar';

function App() {

  return (
    <>
      <NavigationBar />
      <div className='card-xl px-2 px-sm-3'>
        <Routes>
          <Route path="/" element={<Navigate to="cards" />} />
          <Route path="/cards" element={<AllCards />} />
          <Route path="/cards/:card_id" element={<CardInfo />} />
          <Route path="/turns" element={<AllTurns />} />
        </Routes>
      </div>
    </>
  )
}

export default App