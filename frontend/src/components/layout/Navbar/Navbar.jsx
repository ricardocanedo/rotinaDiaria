import { Link, useNavigate } from 'react-router-dom'
import { AuthService } from '../../../services/auth.service'
import { useEffect, useState } from 'react';

function Navbar() {
    const navigate = useNavigate();
    const isAuthenticated = AuthService.isAuthenticated();
    const user = AuthService.getUser();
    const [showLogout, setShowLogout] = useState(false);

    useEffect(() => {
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    Rotina Diária
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/atividades">
                                <span className="btn btn-primary">Gerenciar</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/sobre">
                                <span className="btn btn-primary">Sobre</span>
                            </Link>
                        </li>
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item mt-2 position-relative">
                                    <button 
                                        className="btn btn-raised btn-primary" 
                                        onClick={() => setShowLogout(!showLogout)}
                                    >
                                        Olá, {user?.name}
                                    </button>
                                    {showLogout && (
                                        <button 
                                            className="btn btn-primary" 
                                            onClick={handleLogout}
                                        >
                                            Sair
                                        </button>
                                    )}
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    <span className="btn btn-primary">Login</span>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
