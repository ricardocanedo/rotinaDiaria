import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'

import Navbar from './components/layout/Navbar/Navbar.jsx'
import Home from './pages/Home.jsx'
import Sobre from './pages/Sobre.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Atividades from './pages/Atividades.jsx'

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/atividades" element={<Atividades />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
