import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityService } from '../services/activity.service';
import { translateRepeat } from '../utils/translations';

function Atividades() {
    const [activities, setActivities] = useState([]);
    const [hideCompleted, setHideCompleted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadActivities();

        const currentState = ActivityService.getOcultarAtividadesConcluidas();
        setHideCompleted(currentState);
    }, []);

    const loadActivities = () => {
        const userActivities = ActivityService.getUserActivities();

        const translatedActivities = userActivities.map(activity => ({
            ...activity,
            repeatOriginal: activity.repeat,
            repeat: translateRepeat(activity.repeat) // tradução para exibição
        }))

        setActivities(translatedActivities);
    };

    const handleEdit = (id) => {
        navigate(`/atividades/editar/${id}`);
    };

    const handleAdd = () => {
        navigate('/atividades/editar/nova');
    };

    const handleToogleHideCompleted = (checked) => {
        setHideCompleted(checked);
        ActivityService.onToogleOcultarAtividadesConcluidas(checked);
    }

    return (
        <div className="mt-4">
            <div className="card my-4">
                <div className="card-body rounded" style={{backgroundColor: '#f3f3f3'}}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1>Atividades</h1>
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
                                        <td className='text-capitalize'>{activity.repeat}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="card my-4">
                <div className="card-body">
                    <div className="">
                        <h1>Configurações</h1>
                    </div>

                    <div className="my-4">
                        <div className="form-check form-switch">
                            <input 
                                className="form-check-input"
                                type="checkbox"
                                id="hideCompleted"
                                checked={hideCompleted}
                                onChange={(e) => handleToogleHideCompleted(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="hideCompleted">
                                Ocultar atividades concluídas
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Atividades;