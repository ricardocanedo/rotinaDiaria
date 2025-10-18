import { useState, useEffect } from 'react';
import { ActivityService } from '../services/activity.service';
import { CompletionService } from '../services/completion.service';
import { ToastService } from '../services/toast.service';

function Home() {
    const [currentActivities, setCurrentActivities] = useState([]);

    useEffect(() => {
        loadCurrentActivities();
        // Atualiza a cada minuto
        const interval = setInterval(loadCurrentActivities, 60000);
        return () => clearInterval(interval);
    }, []);

    const loadCurrentActivities = () => {
        const activities = ActivityService.getCurrentActivities();
        setCurrentActivities(activities);
    };

    const handleComplete = (activity) => {
        if (CompletionService.isCompletedToday(activity.id)) {
            ToastService.info('Atividade já foi concluída hoje!');
            return;
        }

        CompletionService.completeActivity(activity.id);
        ToastService.success('Atividade concluída com sucesso!');
        loadCurrentActivities();
    };

    return (
        <div className="container mt-4">
            {currentActivities.map(activity => (
                <div key={activity.id} className="row">
                    <div className="col-xl-7 col-lg-9 col-md-10 col-12 mx-auto mb-4">
                        <div className="card h-100">
                            <div className="card-body" style={{backgroundColor: activity.color}}>
                                <div className="d-flex align-items-center mb-3">
                                    <span className="fs-1 me-2">{activity.icon}</span>
                                    <h3 className="card-title mb-0">{activity.name}</h3>
                                    <div className="ms-auto">
                                        <p className="card-text text-end">
                                            <span>Horário: </span>
                                            <span className='fw-bold'>{activity.time}</span>
                                        </p>
                                    </div>
                                </div>
                                {(activity.imageSrc && activity.imageSrc != '') && (
                                    <div className="text-center mb-3">
                                        <img src={'/img/atividades/' + activity.imageSrc}></img>
                                    </div>
                                )}
                                <p className="card-text text-center">{activity.description}</p>
                                { CompletionService.isCompletedToday(activity.id) ?(
                                    <button 
                                        className='btn btn-success w-100 '
                                        disabled={true}
                                    >
                                        <span className="ms-2">✅</span>
                                        Concluído 
                                    </button>
                                ) 
                                : (
                                    <button 
                                        className='btn btn-warning w-100 '
                                        onClick={() => handleComplete(activity)}
                                    >
                                        Pronto!
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {currentActivities.length === 0 && (
                <div className="col-12 text-center text-white mt-4">
                    <p className="mt-4">Nenhuma atividade precisa ser realizada no momento</p>
                </div>
            )}
        </div>
    );
}

export default Home;