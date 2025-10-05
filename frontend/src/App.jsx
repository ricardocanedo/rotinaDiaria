import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'

import Navbar from './components/layout/Navbar.jsx'
import Home from './pages/Home.jsx'
import Sobre from './pages/Sobre.jsx'
import Login from './pages/Login.jsx'

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
