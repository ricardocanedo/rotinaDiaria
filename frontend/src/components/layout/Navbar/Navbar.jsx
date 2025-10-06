import { Link, useNavigate } from 'react-router-dom'
import { AuthService } from '../../../services/auth.service'
import { useEffect } from 'react';

function Navbar() {
    const navigate = useNavigate();
    const isAuthenticated = AuthService.isAuthenticated();
    const user = AuthService.getUser();

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
                            <Link className="nav-link" to="/sobre">Sobre</Link>
                        </li>
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link">Olá, {user?.name}</span>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className="btn btn-link nav-link" 
                                        onClick={handleLogout}
                                    >
                                        Sair
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
