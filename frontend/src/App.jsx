import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

import Navbar from './components/layout/Navbar/Navbar.jsx'
import Home from './pages/Home.jsx'
import Sobre from './pages/Sobre.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Atividades from './pages/Atividades.jsx'
import EditarAtividade from './pages/EditarAtividade.jsx'

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/atividades" element={<Atividades />} />
            <Route path="/atividades/editar/:id" element={<EditarAtividade />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
