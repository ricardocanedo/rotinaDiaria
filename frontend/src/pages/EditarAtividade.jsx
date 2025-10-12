import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ActivityService } from '../services/activity.service';
import { ToastService } from '../services/toast.service';

function EditarAtividade() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activity, setActivity] = useState({
        id: null,
        name: '',
        icon: '',
        color: '',
        category: '',
        description: '',
        time: '',
        isActive: true,
        repeat: 'none'
    });

    const [availableActivities, setAvailableActivities] = useState([]);

    useEffect(() => {
        setAvailableActivities(ActivityService.getAvailableActivities());
        
        if (id && id !== 'nova') {
            const existing = ActivityService.getUserActivity(Number(id));
            if (existing) {
                setActivity(existing);
            }
        }
    }, [id]);

    const handleActivitySelect = (baseActivity) => {
        setActivity(prev => ({
            ...prev,
            ...baseActivity
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            ActivityService.saveUserActivity(activity);
            ToastService.success('Atividade salva com sucesso!');
            navigate('/atividades');
        } catch (error) {
            ToastService.error('Erro ao salvar atividade');
        }
    };

    const handleDelete = () => {
        if (window.confirm('Deseja realmente excluir esta atividade?')) {
            ActivityService.deleteUserActivity(Number(id));
            ToastService.success('Atividade excluída com sucesso!');
            navigate('/atividades');
        }
    };

    return (
        <div className="mt-4">
            <h1 className="text-white">{id === 'nova' ? 'Nova Atividade' : 'Editar Atividade'}</h1>
            
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label className="form-label">Atividade Base</label>
                    <select 
                        className="form-select"
                        onChange={(e) => handleActivitySelect(availableActivities[e.target.value])}
                    >
                        <option value="">Selecione uma atividade</option>
                        {availableActivities.map((act, index) => (
                            <option key={index} value={index}>
                                {act.icon} {act.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Horário</label>
                    <input
                        type="time"
                        className="form-control"
                        value={activity.time}
                        onChange={(e) => setActivity({...activity, time: e.target.value})}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Repetição</label>
                    <select 
                        className="form-select"
                        value={activity.repeat}
                        onChange={(e) => setActivity({...activity, repeat: e.target.value})}
                    >
                        <option value="none">Não repete</option>
                        <option value="daily">Diariamente</option>
                        <option value="weekly">Semanalmente</option>
                    </select>
                </div>

                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="isActive"
                        checked={activity.isActive}
                        onChange={(e) => setActivity({...activity, isActive: e.target.checked})}
                    />
                    <label className="form-check-label" htmlFor="isActive">Ativo</label>
                </div>

                <div className="mt-4">
                    <button type="submit" className="btn btn-success me-2">
                        Salvar
                    </button>
                    <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/atividades')}>
                        Cancelar
                    </button>
                    {id !== 'nova' && (
                        <button type="button" className="btn btn-danger" onClick={handleDelete}>
                            Excluir
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default EditarAtividade;
