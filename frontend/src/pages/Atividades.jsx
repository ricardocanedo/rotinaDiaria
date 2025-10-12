import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityService } from '../services/activity.service';

function Atividades() {
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = () => {
        const userActivities = ActivityService.getUserActivities();
        setActivities(userActivities);
    };

    const handleEdit = (id) => {
        navigate(`/atividades/editar/${id}`);
    };

    const handleAdd = () => {
        navigate('/atividades/editar/nova');
    };

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-white">Atividades</h1>
                <button className="btn btn-success" onClick={handleAdd}>
                    Nova Atividade
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Ícone</th>
                            <th>Nome</th>
                            <th>Horário</th>
                            <th>Status</th>
                            <th>Repetição</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map((activity) => (
                            <tr 
                                key={activity.id} 
                                onClick={() => handleEdit(activity.id)}
                                style={{cursor: 'pointer'}}
                            >
                                <td>{activity.icon}</td>
                                <td>{activity.name}</td>
                                <td>{activity.time}</td>
                                <td>{activity.isActive ? 'Ativo' : 'Inativo'}</td>
                                <td>{activity.repeat}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Atividades;