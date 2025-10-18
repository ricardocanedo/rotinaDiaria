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
                        <div className="card rounded-4 h-100" style={{backgroundColor: activity.color}}>
                            <div className="card-header bg-transparent border-0 p-0">
                                <div className="card-header d-flex align-items-center rounded-top-4 py-2 px-4 mb-1" style={{backgroundColor: '#cecece30'}}>
                                    <span className="fs-2 me-2">{activity.icon}</span>
                                    <h2 className="card-title mb-0">{activity.name}</h2>
                                    <div className="ms-auto">
                                        <p className="card-text text-end">
                                            <span>Horário: </span>
                                            <span className='fw-bold'>{activity.time}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body rounded-4">
                                {(activity.imageSrc && activity.imageSrc != '') && (
                                    <div className="text-center mb-3">
                                        <img 
                                            src={'/img/atividades/' + activity.imageSrc} 
                                            className='rounded-2'
                                            style={{minWidth: '180px', height: 'auto'}}
                                            alt={activity.name}
                                        ></img>
                                    </div>
                                )}
                                <p className="card-text text-center">{activity.description}</p>
                                { CompletionService.isCompletedToday(activity.id) ?(
                                    <button 
                                        className='btn btn-success rounded-4 w-100 p-3'
                                        disabled={true}
                                    >
                                        <span className="mx-2">✅</span>
                                        Concluído 
                                    </button>
                                ) 
                                : (
                                    <button 
                                        className='btn btn-warning rounded-4 w-100 p-3'
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