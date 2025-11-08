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
        ToastService.success('Atividade concluída! +1 moeda 💰');
        loadCurrentActivities();
    };

    return (
        <div className="container mt-4">
            <div className="row">
                {currentActivities.map(activity => (
                    <div key={activity.id} className="col-xl-4 col-lg-6 col-md-10 col-12 mx-lg-0 mx-auto mb-4">
                        <div className="card rounded-4 h-100" style={{backgroundColor: activity.color}}>
                            <div className="card-header bg-transparent border-0 p-0">
                                <div className="card-header d-flex align-items-center rounded-top-4 py-2 px-3 mb-1" style={{backgroundColor: '#cecece30'}}>
                                    <span className="fs-4 me-2">{activity.icon}</span>
                                    <h5 className="card-title text-uppercase mb-0">{activity.name}</h5>
                                    <div className="ms-auto">
                                        <p className="card-text text-end">
                                            <span className='fw-bold'>{activity.time}</span>
                                            <span> h</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body rounded-4 d-flex flex-column">
                                {(activity.imageSrc && activity.imageSrc != '') && (
                                    <div className="text-center mb-3">
                                        <img 
                                            src={'/img/atividades/' + activity.imageSrc} 
                                            className='rounded-2'
                                            style={{width: '220px', height: 'auto'}}
                                            alt={activity.name}
                                        ></img>
                                    </div>
                                )}
                                <p className="card-text text-center text-uppercase">{activity.description}</p>
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
                                        className='btn btn-warning rounded-4 w-100 p-3 mt-auto'
                                        onClick={() => handleComplete(activity)}
                                    >
                                        Pronto!
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {currentActivities.length === 0 && (
                <div className="col-12 text-center text-white mt-4">
                    <p className="mt-4">Nenhuma atividade precisa ser realizada no momento</p>
                </div>
            )}
        </div>
    );
}

export default Home;